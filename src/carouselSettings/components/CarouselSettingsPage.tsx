import React, { useEffect, useState } from "react"
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { configurationMenuUrl } from "@dashboard/configuration";
import ProductMedia from "@dashboard/products/components/ProductMedia";
import { ProductMediaFragment, ProductMediaType, useCarouselUrlsQuery, useCarouselUpdateMutation } from "@dashboard/graphql";
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
        console.error(data.carouselSettingsUpdate.errors)
      }
      else {
        notifySaved();
      }
    },
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
    console.log(newUrl)
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
          getImageEditUrl={(url) => url}
          onImageDelete={handleCarouselDelete}
          onImageUpload={() => () => { }}
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