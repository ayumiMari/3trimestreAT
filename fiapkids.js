//instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

//configurando o acesso ao mongodb
mongoose.connect("mongodb://127.0.0.1:27017/fiapkids", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000,
});

//criando a model/collection do seu projeto - começo da model usuario
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
});

const Usuario = mongoose.model("usuario", UsuarioSchema);

//configurando os roteamentos da model usuario
app.post("/cadastrousuario", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;

  //testando se todos os campos foram preenchidos
  if (nome == null || email == null || senha == null) {
    return res.status(400).json({ error: "Preencher todos os campos" });
  }

  //teste mais importante da ac
  const emailExiste = await Usuario.findOne({ email: email });

  if (emailExiste) {
    return res
      .status(400)
      .json({ error: "Esse email já está registrado no sistema." });
  }

  //como fica no postman pra add
  const usuario = new Usuario({
    nome: nome,
    email: email,
    senha: senha,
  });

  try {
    const newUsuario = await usuario.save();
    res.json({ error: null, msg: "Cadastro ok", usuarioId: newUsuario._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});
// fim da model usuario

// começo da model especifica - produtoBrinquedo
const produtoBrinquedoSchema = new mongoose.Schema({
  cod_produtoBrinquedo: { type: String, required: true },
  descricao: { type: String, required: true },
  fornecedor: { type: String, required: true },
  data_fabricacao: { type: Date, required: true },
  quant_estoque: { type: Number, required: true },
});

const ProdutoBrinquedo = mongoose.model(
  "produtoBrinquedo",
  produtoBrinquedoSchema
);

//configurando os roteamentos da model usuario
app.post("/cadastroprodutoBrinquedo", async (req, res) => {
  const cod_produtoBrinquedo = req.body.cod_produtoBrinquedo;
  const descricao = req.body.descricao;
  const fornecedor = req.body.fornecedor;
  const data_fabricacao = req.body.data_fabricacao;
  const quant_estoque = req.body.quant_estoque;

  //testando se todos os campos foram preenchidos
  if (cod_produtoBrinquedo == null ||descricao == null ||fornecedor == null ||data_fabricacao == null ||quant_estoque == null) {
    return res.status(400).json({ error: "Preencher todos os campos" });
  }

  //verificar se já existe o id
  const cod_produtoBrinquedoExiste = await ProdutoBrinquedo.findOne({
    cod_produtoBrinquedo: cod_produtoBrinquedo,
  });

  if (cod_produtoBrinquedoExiste) {
    return res
      .status(400)
      .json({ error: "Esse código já está registrado no sistema." });
  }

  //como fica no postman pra add
  const produtoBrinquedo = new ProdutoBrinquedo({
    cod_produtoBrinquedo: cod_produtoBrinquedo,
    descricao: descricao,
    fornecedor: fornecedor,
    data_fabricacao: data_fabricacao,
    quant_estoque: quant_estoque,
  });

  try {
    const newProdutoBrinquedo = await produtoBrinquedo.save();
    res.json({
      error: null,
      msg: "Cadastro ok",
      produtoBrinquedoId: newProdutoBrinquedo._id,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get("/cadastrousuario", async (req, res) => {
  res.sendFile(__dirname + "/cadastrousuario.html");
});

app.get("/cadastroprodutoBrinquedo", async (req, res) => {
  res.sendFile(__dirname + "/cadastroprodutoBinquedo.html");
});

//rota raiz - inicio do inw por causa da pág html
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//configurando a porta - pra ler que vc ta usando a porta 3000 no mongo e no postman
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
