import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SpacerV } from "../../elements/Spacers";
import { Asset } from "../../models/Asset";
import { BuyRoute } from "../../models/BuyRoute";
import { getAssets, postBuyRoute } from "../../services/ApiService";
import AppStyles from "../../styles/AppStyles";
import Validations from "../../utils/Validations";
import DeFiPicker from "../form/DeFiPicker";
import Form from "../form/Form";
import Input from "../form/Input";
import LoadingButton from "../util/LoadingButton";

const BuyRouteEdit = ({
  isVisible,
  onRouteCreated,
}: {
  isVisible: boolean;
  onRouteCreated: (route: BuyRoute) => void;
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BuyRoute>();

  const [isSaving, setIsSaving] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => reset({ asset: assets[0] }), [isVisible]);
  useEffect(() => {
    getAssets().then(setAssets);
  }, []);

  const onSubmit = (route: BuyRoute) => {
    setIsSaving(true);
    postBuyRoute(route)
      .then((newRoute) => onRouteCreated(newRoute))
      .finally(() => setIsSaving(false));
  };

  // TODO: react on collisions (buy&sell)

  const rules: any = {
    asset: Validations.Required(t),
    iban: { ...Validations.Required(t), ...Validations.Iban(t) }
  };

  return (
    <Form control={control} rules={rules} errors={errors} editable={!isSaving} onSubmit={handleSubmit(onSubmit)}>
      <DeFiPicker name="asset" label={t("model.route.asset")} items={assets.filter((a) => a.buyable)} idProp="id" labelProp="name" />
      <SpacerV />

      <Input name="iban" label={t("model.route.iban")} placeholder="DE89 3704 0044 0532 0130 00" />
      <SpacerV />

      <View style={[AppStyles.containerHorizontal, AppStyles.mla]}>
        <LoadingButton title={t("action.save")} isLoading={isSaving} onPress={handleSubmit(onSubmit)} />
      </View>
    </Form>
  );
};

export default BuyRouteEdit;