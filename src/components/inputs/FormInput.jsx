import { Form, Input } from "antd";

const FormInput = ({
  name,
  label,
  placeholder,
  rules,
  inputProps,
  noFormItem = false,
}) => {
  const inputElement = (
    <Input
      size="large"
      placeholder={placeholder}
      {...inputProps}
    />
  );

  if (noFormItem) {
    return inputElement;
  }

  return (
    <Form.Item name={name} label={label} rules={rules} hasFeedback>
      {inputElement}
    </Form.Item>
  );
};

export default FormInput;