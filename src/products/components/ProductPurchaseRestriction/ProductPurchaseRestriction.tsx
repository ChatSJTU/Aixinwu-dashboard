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
import { InputAdornment, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import dayjs from 'dayjs';

interface ProductPurchaseRestrictionProps {
  product: ProductDetailsQuery["product"];
  data: ProductUpdateData;
  onChange: (event: React.ChangeEvent<any>) => void;
  onChangeMetadata: FormChange;
}

export const useCommonStyles = makeStyles(
  theme => ({
    input: {
      padding: "12px 0 9px 12px",
    },
  }),
);

export const ProductPurchaseRestriction: React.FC<ProductPurchaseRestrictionProps> = ({
  product,
  data,
  onChange,
  onChangeMetadata,
}) => {
  const intl = useIntl();
  const commonClasses = useCommonStyles({});
  const OnlyPoorKey = "only_poor";
  const AllowPositionsKey = "allow_positions";
  const AllowDateDeltaKey = "allow_admission_date";
  const MaxGraduateDateKey = "allow_graduate_date";
  const CodeRegexKey = "code_regex";
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [allUserPositions, setAllUserPositions] = useState<UserPosition[]>(userPositions);
  const [usePosition, setUsePosition] = useState<boolean>(false);
  const [useDateDelta, setUseDateDelta] = useState<boolean>(false);
  const [useMaxGraduateDate, setUseMaxGraduateDate] = useState<boolean>(false);
  const [useCodeRegex, setUseCodeRegex] = useState<boolean>(false);
  const [positionInputs, setPositionInputs] = useState<UserPosition[]>([]);
  const [dateDeltaInput, setDateDeltaInput] = useState<string>("0");
  const [maxGraduateDateInput, setMaxGraduateDateInput] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [codeRegexInput, setCodeRegexInput] = useState<string>("^$");

  useEffect(()=>{
    var positions = data?.metadata?.find(x=>x.key==AllowPositionsKey)?.value;
    if (positions && positions.length > 0) {
      setUsePosition(true);
      setPositionInputs(ParseUserPositions(positions));
    }
    var dateDelta = data?.metadata?.find(x=>x.key==AllowDateDeltaKey)?.value;
    if (dateDelta && dateDelta.length > 0) {
      setUseDateDelta(true);
      setDateDeltaInput(dateDelta);
    }
    var maxGraduateDate = data?.metadata?.find(x=>x.key==MaxGraduateDateKey)?.value;
    if (maxGraduateDate && maxGraduateDate.length > 0) {
      setUseMaxGraduateDate(true);
      setMaxGraduateDateInput(maxGraduateDate);
    }
    var codeRegex = data?.metadata?.find(x=>x.key==CodeRegexKey)?.value;
    if (codeRegex && codeRegex.length > 0) {
      setUseCodeRegex(true);
      setCodeRegexInput(codeRegex);
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

  const onDateDeltaChange = (enable: boolean, value: string) => {
    const key = "metadata";
    const dataToUpdate: MetadataInput[] = data.metadata;
    const value_norm = parseInt(value).toString();
    if (enable) {
      var dataCopy = (
        dataToUpdate.some(x=>x.key == AllowDateDeltaKey) ? (
          dataToUpdate.map(x=>(x.key == AllowDateDeltaKey ? {...x, value: value_norm} : x))
        ) : dataToUpdate.concat({ key: AllowDateDeltaKey, value: value_norm })
      );
      onChangeMetadata({
        target: {
          name: key,
          value: dataCopy,
        },
      });
    }
    else { //delete
      var dataCopy = (
        dataToUpdate.some(x=>x.key == AllowDateDeltaKey) ? (
          dataToUpdate.filter(x=>(x.key != AllowDateDeltaKey))
        ) : dataToUpdate
      );
      onChangeMetadata({
        target: {
          name: key,
          value: dataCopy,
        },
      });
    }
  }

  const onMaxGraduateDateChange = (enable: boolean, value: string) => {
    const key = "metadata";
    const dataToUpdate: MetadataInput[] = data.metadata;
    const value_norm = dayjs(value).format('YYYY-MM-DD');
    if (enable) {
      var dataCopy = (
        dataToUpdate.some(x=>x.key == MaxGraduateDateKey) ? (
          dataToUpdate.map(x=>(x.key == MaxGraduateDateKey ? {...x, value: value_norm} : x))
        ) : dataToUpdate.concat({ key: MaxGraduateDateKey, value: value_norm })
      );
      onChangeMetadata({
        target: {
          name: key,
          value: dataCopy,
        },
      });
    }
    else { //delete
      var dataCopy = (
        dataToUpdate.some(x=>x.key == MaxGraduateDateKey) ? (
          dataToUpdate.filter(x=>(x.key != MaxGraduateDateKey))
        ) : dataToUpdate
      );
      onChangeMetadata({
        target: {
          name: key,
          value: dataCopy,
        },
      });
    }
  }

  const onCodeRegexChange = (enable: boolean, value: string) => {
    const key = "metadata";
    const dataToUpdate: MetadataInput[] = data.metadata;
    if (enable) {
      var dataCopy = (
        dataToUpdate.some(x=>x.key == CodeRegexKey) ? (
          dataToUpdate.map(x=>(x.key == CodeRegexKey ? {...x, value: value} : x))
        ) : dataToUpdate.concat({ key: CodeRegexKey, value: value })
      );
      onChangeMetadata({
        target: {
          name: key,
          value: dataCopy,
        },
      });
    }
    else { //delete
      var dataCopy = (
        dataToUpdate.some(x=>x.key == CodeRegexKey) ? (
          dataToUpdate.filter(x=>(x.key != CodeRegexKey))
        ) : dataToUpdate
      );
      onChangeMetadata({
        target: {
          name: key,
          value: dataCopy,
        },
      });
    }
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
          <Box display='flex' alignItems='center'>
            <ControlledCheckbox
              checked={useDateDelta}
              label={"限制入学时间"}
              name={AllowDateDeltaKey}
              onChange={(e) => { 
                setUseDateDelta(e.target.value); 
                onDateDeltaChange(e.target.value, dateDeltaInput);
              }}
            />
            {
              useDateDelta ? (
                <TextField
                  style={{ width: '100px' }}
                  InputProps={{ 
                    classes: { input: commonClasses.input }, 
                    endAdornment: <InputAdornment position="end">天</InputAdornment> 
                  }}
                  value={dateDeltaInput}
                  type="number"
                  onChange={e => {
                    setDateDeltaInput(e.target.value);
                    onDateDeltaChange(useDateDelta, e.target.value);
                  }}
                />
              ) : undefined
            }
          </Box>
          <Box display='flex' alignItems='center'>
            <ControlledCheckbox
              checked={useMaxGraduateDate}
              label={"限制毕业时间"}
              name={MaxGraduateDateKey}
              onChange={(e) => { 
                setUseMaxGraduateDate(e.target.value); 
                onMaxGraduateDateChange(e.target.value, maxGraduateDateInput);
              }}
            />
            {
              useMaxGraduateDate ? (
                <TextField
                  style={{ width: '200px' }}
                  InputProps={{ 
                    classes: { input: commonClasses.input }, 
                    startAdornment: <InputAdornment position="start">最晚</InputAdornment> 
                  }}
                  value={maxGraduateDateInput}
                  type="date"
                  onChange={e => {
                    setMaxGraduateDateInput(e.target.value);
                    onMaxGraduateDateChange(useMaxGraduateDate, e.target.value);
                  }}
                />
              ) : undefined
            }
          </Box>
          <Box display='flex' alignItems='center'>
            <ControlledCheckbox
              checked={useCodeRegex}
              label={"限制学号"}
              name={CodeRegexKey}
              onChange={(e) => { 
                setUseCodeRegex(e.target.value); 
                onCodeRegexChange(e.target.value, codeRegexInput);
              }}
            />
            {
              useCodeRegex ? (
                <TextField
                  style={{ width: '200px' }}
                  InputProps={{ 
                    classes: { input: commonClasses.input }, 
                  }}
                  value={codeRegexInput}
                  type="text"
                  onChange={e => {
                    setCodeRegexInput(e.target.value);
                    onCodeRegexChange(useCodeRegex, e.target.value);
                  }}
                />
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
  