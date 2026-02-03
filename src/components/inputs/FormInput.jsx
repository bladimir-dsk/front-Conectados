import { Form, Input } from "antd";

const FormInput = ({
  name,
  label,
  rules = [],
  placeholder,
  size = "large",
  hasFeedback = true,
  validateTrigger = "onChange",
  validateDebounce,
  validateFirst = false,
  formItemProps = {},
  inputProps = {},
}) => {
  const { type, ...restInputProps } = inputProps;

  const InputComponent = type === "password" ? Input.Password : Input;

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      hasFeedback={hasFeedback}
      validateTrigger={validateTrigger}
      validateDebounce={validateDebounce}
      validateFirst={validateFirst}
      {...formItemProps}
    >
      <InputComponent placeholder={placeholder} size={size} {...restInputProps} />
    </Form.Item>
  );
};

export default FormInput;
