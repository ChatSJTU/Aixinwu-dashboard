import { DashboardCard } from "@dashboard/components/Card";
import { MetadataInput, ProductDetailsQuery } from "@dashboard/graphql";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ProductUpdateData } from "../ProductUpdatePage/types";
import { FormChange } from "@dashboard/hooks/useForm";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import AssignContainerDialog from "@dashboard/components/AssignContainerDialog";
import { ParseUserPositions, transformUserPosition, UserPosition, userPositions } from "@dashboard/customers/utils";
import { Box, Button } from "@saleor/macaw-ui-next";
import { Pill } from "@dashboard/components/Pill";

interface ProductPurchaseRestrictionProps {
  product: ProductDetailsQuery["product"];
  data: ProductUpdateData;
  onChange: (event: React.ChangeEvent<any>) => void;
  onChangeMetadata: FormChange;
}

export const ProductPurchaseRestriction: React.FC<ProductPurchaseRestrictionProps> = ({
  product,
  data,
  onChange,
  onChangeMetadata,
}) => {
  const intl = useIntl();
  const OnlyPoorKey = "only_poor";
  const AllowPositionsKey = "allow_positions";
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allUserPositions, setAllUserPositions] = useState<UserPosition[]>(userPositions);
  const [usePosition, setUsePosition] = useState<boolean>(false);
  const [positionInputs, setPositionInputs] = useState<UserPosition[]>([]);

  useEffect(()=>{
    var positions = data?.metadata?.find(x=>x.key==AllowPositionsKey)?.value;
    if (positions && positions.length > 0) {
      setUsePosition(true);
      setPositionInputs(ParseUserPositions(positions));
    }
  }, [data]);

  useEffect(()=>{
    if (data && data.metadata) {
      if (usePosition) 
        onPositionsChange(positionInputs);
      else
        onPositionsChange([]);
    }
  }, [usePosition]);

  const onPositionsChange = (values: UserPosition[]) => {
    const value = String(values.map(x=>x.id).join(","));
    const key = "metadata";
    const dataToUpdate: MetadataInput[] = data.metadata;

    var dataCopy = (
      dataToUpdate.some(x=>x.key == AllowPositionsKey) ? (
        dataToUpdate.map(x=>(x.key == AllowPositionsKey ? {...x, value: value} : x))
      ) : dataToUpdate.concat({ key: AllowPositionsKey, value: value })
    );
    onChangeMetadata({
      target: {
        name: key,
        value: dataCopy,
      },
    });
  }

  const onOnlyPoorChange = (e: any) => {
    const value = String(e.target.value);
    const key = "metadata";
    const dataToUpdate: MetadataInput[] = data.metadata;

    var dataCopy = (
      dataToUpdate.some(x=>x.key == OnlyPoorKey) ? (
        dataToUpdate.map(x=>(x.key == OnlyPoorKey ? {...x, value: value} : x))
      ) : dataToUpdate.concat({ key: OnlyPoorKey, value: value })
    );
    onChangeMetadata({
      target: {
        name: key,
        value: dataCopy,
      },
    });
  }

  return (
    <DashboardCard>
      <DashboardCard.Title>
        <FormattedMessage 
          id="product-detail-purchase-restriction" 
          defaultMessage="身份限制" 
        />
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Box display="grid" gap={2} marginTop={0}>
          <ControlledCheckbox
          checked={data?.metadata?.find(x=>x.key==OnlyPoorKey)?.value == 'true'}
          label={"仅限贫困生购买"}
          name={OnlyPoorKey}
          onChange={onOnlyPoorChange}
          />
          <Box display='flex' alignItems='center'>
            <ControlledCheckbox
            checked={usePosition}
            label={"仅限特定身份用户购买"}
            name={AllowPositionsKey}
            onChange={(e) => { setUsePosition(e.target.value); }}
            />
            <Button
              onClick={()=>{ setModalOpen(true); }}
              data-test-id="channels-availability-manage-button"
              type="button"
              variant="secondary"
            >
              ...
            </Button>
          </Box>
          <Box display="flex" gap={1} alignItems='center' flexWrap='wrap' paddingTop={0}>
            {
                usePosition ? (
                positionInputs
                    .map(x=>(
                        <Pill label={x.name} color='generic'/>
                    ))
                ) : undefined
            }
          </Box>
        </Box>
      </DashboardCard.Content>
      <AssignContainerDialog
        containers={allUserPositions.map(x=>({...x, name: `${x.name} (${x.id})`}))}
        labels={{
            title: "请选择限购身份（可多选）",
            label: "搜索身份",
            placeholder: "请输入关键字",
            confirmBtn: "确定",
        }}
        confirmButtonState={"default"}
        hasMore={false}
        open={modalOpen}
        onFetch={(value) => {
          setAllUserPositions(
            userPositions.filter(x=>(x.name.includes(value) || x.id.includes(value)))
          )
        }}
        onFetchMore={() => {}}
        loading={false}
        onClose={() => { setModalOpen(false); }}
        onSubmit={data =>
          {
            setPositionInputs(data);
            onPositionsChange(data);
            setModalOpen(false);
          }
        }
      />
    </DashboardCard>
  );
};
ProductPurchaseRestriction.displayName = "ProductPurchaseRestriction";
export default ProductPurchaseRestriction;
  