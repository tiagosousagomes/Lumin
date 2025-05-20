module.exports = {
  validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  message: (props) => `${props.value} não é um e-mail válido!`
}