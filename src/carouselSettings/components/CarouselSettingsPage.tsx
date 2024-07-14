import React, { useEffect, useState } from "react"
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { configurationMenuUrl } from "@dashboard/configuration";
import ProductMedia from "@dashboard/products/components/ProductMedia";
import { ProductMediaFragment, ProductMediaType, useCarouselUrlsQuery, useCarouselUpdateMutation, useSingleFileUploadMutation } from "@dashboard/graphql";
import { useIntl } from "react-intl";
import { commonMessages, sectionNames } from "@dashboard/intl";
import useNotifier from "@dashboard/hooks/useNotifier";
import UrlInputModal from "./UrlInputModal";

const mapImageUrlsToProductMediaFragments = (imageUrls: string[]): ProductMediaFragment[] => {
  return imageUrls.map((imageUrl, index) => ({
    __typename: 'ProductMedia',
    id: String(index),
    alt: '',
    sortOrder: index,
    url: imageUrl,
    type: ProductMediaType.IMAGE,
    oembedData: null,
  }));
};

export const CarouselSettingsPage: React.FC = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const { data: carouselUrlQueryData, refetch: refetchCarouselUrls } = useCarouselUrlsQuery({ displayLoader: false });
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [carouselUrls, setCarouselUrls] = useState<string[]>([]);
  const [carouselMedia, setCarouselMedia] = useState<ProductMediaFragment[] | null>(null);

  const notifySaved = () =>
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges),
    });

  const [carouselUpdate, carouselUpdateOpts] = useCarouselUpdateMutation({
    onCompleted: data => {
      if (data.carouselSettingsUpdate.errors.length !== 0) {
        console.error(data.carouselSettingsUpdate.errors[0].message)
      }
      else {
        notifySaved();
      }
    },
  })

  const [carouselUpload, carouselUploadOpts] = useSingleFileUploadMutation({
    onCompleted: data => {
      if (data.fileUpload.errors.length !== 0) {
        console.error(data.fileUpload.errors[0].message)
      }
      else if (!data.fileUpload.uploadedFile.url) {
        console.error(intl.formatMessage({
          id: "ase8dq",
          defaultMessage: "Failed to fetch response url for uploaded"
        }));
      }
      else {
        let url = data.fileUpload.uploadedFile.url;
        handleCarouselSubmit(url)
      }
    }
  })

  const handleCarouselDelete = (id: string) => () => {
    carouselUpdate({
      variables: {
        urls: carouselUrls.filter((value, index) => String(index) !== id),
      },
      update: (cache, { data: updateData }) => {
        if (updateData) {
          refetchCarouselUrls();
        }
      }
    });
  }

  const handleCarouselSubmit = (newUrl: string) => {
    carouselUpdate({
      variables: {
        urls: [...carouselUrls, newUrl],
      },
      update: (cache, { data: updateData }) => {
        if (updateData) {
          refetchCarouselUrls();
        }
      }
    });
  }

  const handleCarouseUpload = (file: File) => {
    const maxFileSize = 10 * 1024 * 1024;

    if(!file) {
      console.error("Error: File does not exist!")
      return;
    }

    if(file.size > maxFileSize) {
      console.error("Error: File size exceeds 10MB!")
      return;
    }

    if(!['image/jpeg', 'image/png', 'image/gif'].includes(file.type) && !file.name.endsWith(".webp")) {
      console.error("Error: File type is not image!")
      return;
    }

    // 返回Promise对象才能正确触发 onAfterUpload 事件
    return carouselUpload({
      variables: {
        file: file,
      }
    })
  }


  useEffect(() => {
    if (carouselUrlQueryData) {
      let urls = carouselUrlQueryData.carousel.urls;
      setCarouselUrls(urls);
      setCarouselMedia(mapImageUrlsToProductMediaFragments(urls));
    }
  }, [carouselUrlQueryData])

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.carouselSettings)} />
      {carouselMedia &&
        <ProductMedia
          media={carouselMedia}
          allowMultipleUpload={false}
          getImageEditUrl={()=>''}
          onImageDelete={handleCarouselDelete}
          onImageUpload={handleCarouseUpload}
          openMediaUrlModal={() => setModalOpen(true)}
        />
      }
      <UrlInputModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUrlSubmit={(url) => handleCarouselSubmit(url)}
      />
    </DetailPageLayout>
  );
}