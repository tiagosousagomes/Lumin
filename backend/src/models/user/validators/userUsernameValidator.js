module.exports = {
    validator: function(v) {
        return /^[a-zA-Z0-9._]+$/.test(v); // Apenas letras, números e underscores
    },
    message: (props) => `${props.value} não é um nome de usuário válido!`,
}