import { Form, Input } from "antd";

const FormInput = ({
  name,
  label,
  rules = [],
  placeholder,
  hasFeedback = true,
  validateTrigger = "onChange",
  validateDebounce,
  validateFirst = false,
  formItemProps = {},
  inputProps = {},
}) => {
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
      <Input placeholder={placeholder} {...inputProps} />
    </Form.Item>
  );
};

export default FormInput;
