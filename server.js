// // const express = require("express");
// // const bodyParser = require("body-parser");
// // const app = express();
// // const cors = require("cors");
// // const mysql = require('mysql2');
// // const port = 2828;
// // const dotenv = require('dotenv');

// // let webhookData = null;

// // app.use(express.static('public'));
// // app.use(bodyParser.json({ limit: '50mb' }));
// // app.use(cors());
// // dotenv.config();
// // const env = process.env;

// // app.post("/api/receber-dados", (req, res) => {
// //   webhookData = req.body;

// //   console.log("Recebido webhook com os seguintes dados:", webhookData);
// //   res.status(200);
// // });

// // const connection = mysql.createConnection({
// //   host: 'localhost',
// //   user: 'carlos',
// //   password: '280104gui',
// //   database: 'api_whatsapp',
// // });

// // connection.connect((err) => {
// //   if (err) {
// //     console.error('Erro ao conectar ao banco de dados:', err);
// //   } else {
// //     console.log('Conectado ao banco de dados MySQL');
// //   }
// // });

// // app.get("/api/visualizar-dados", (req, res) => {
// //   if (webhookData !== null) {
// //     res.status(200).json(webhookData);
// //   } else {
// //     res.status(404).send("Nenhum dado de webhook disponível.");
// //   }
// // });
// // app.use((req, res) => {
// //   res.status(404).send("cheguei no post1.");
// // });

// // app.listen(port, () => {
// //   console.log(`rodando na:  `);
// // });
// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const cors = require("cors");
// const mysql = require("mysql2");
// const port = 2828;
// const dotenv = require("dotenv");

// app.use(express.static("public"));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(cors());
// dotenv.config();
// const env = process.env;

// //let webhookData = null;

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "carlos",
//   password: "280104gui",
//   database: "api_whatsapp",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Erro ao conectar ao banco de dados:", err);
//   } else {
//     console.log("Conectado ao banco de dados MySQL");
//   }
// });

// app.post("/api/receber-dados", (req, res) => {
//   webhookData = req.body;
//   console.log(webhookData);
//   if (webhookData.body && webhookData.body.key && webhookData.body.pushName || webhookData.body.key.fromMe !== true) {
//     const numeroCliente = webhookData.body.key.remoteJid;
//     const nomeCliente = webhookData.body.pushName;
//     if(webhookData.body.message.conversation){
//       const mensagem = webhookData.body.message.conversation;
//       console.log(mensagem)
//       console.log("dentro")
//     } else if(webhookData.body.message.extendedTextMessage){
//       const mensagem = webhookData.body.message.extendedTextMessage;
//       console.log(mensagem)
//       console.log("fora")

//     }
//     // const mensagem = webhookData.body.message.conversation;
//     // const mensagem = webhookData.body.message.extendedTextMessage.text;
//     const idMensagem = webhookData.body.key.id;
//     const timestampMensagem = webhookData.body.messageTimestamp;
//     const fromMe = webhookData.body.key.fromMe
//     // Verifique se o cliente já existe
//     connection.query(
//       "SELECT clienteID FROM Cliente WHERE numero = ?",
//       [numeroCliente],
//       (err, results) => {
//         if (err) {
//           console.error("Erro ao verificar se o cliente existe:", err);
//         } else {
//           if (results.length === 0) {
//             // O cliente não existe, então insira as informações
//             connection.query(
//               "INSERT INTO Cliente (numero, nome_cliente) VALUES (?, ?)",
//               [numeroCliente, nomeCliente],
//               (err, result) => {
//                 if (err) {
//                   console.error("Erro ao inserir informações do cliente:", err);
//                 }
//               }
//             );
//           } 

//           // Recupere o ID do cliente 
//           connection.query(
//             "SELECT clienteID FROM Cliente WHERE numero = ?",
//             [numeroCliente],
//             (err, results) => {
//               if (err) {
//                 console.error("Erro ao recuperar o ID do cliente:", err);
//               } else {
//                 const clienteId = results[0].clienteID;

//                 // Insira a mensagem relacionada ao cliente
//                 connection.query(
//                   "INSERT INTO Mensagem (remetente,conteudo) VALUES ( ?, ?)",
//                   [clienteId, mensagem],
//                   (err, result) => {
//                     if (err) {
//                       console.error("Erro ao inserir a mensagem:", err);
//                     }
//                   }
//                 );
//               }
//             }
//           );
//         }
//       }
//     );
//   } else {
//     console.error("Dados do webhook não possuem informações válidas.");
//   }

//   res.status(200).send("Dados recebidos com sucesso.");
// });

// app.get("/api/visualizar-dados", (req, res) => {
//   if (webhookData !== null) {
//     res.status(200).json(webhookData);
//   } else {
//     res.status(404).send("Nenhum dado de webhook disponível.");
//   }
// });

// app.use((req, res) => {
//   res.status(404).send("Rota não encontrada.");
// });

// app.listen(port, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });


const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const port = 2828;
const dotenv = require("dotenv");

app.use(express.static("public"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
dotenv.config();
const env = process.env;

const connection = mysql.createConnection({
  host: "localhost",
  user: "carlos",
  password: "280104gui",
  database: "api_whatsapp",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados MySQL");
  }
});

// Função para extrair a mensagem de forma flexível
function extrairMensagem(webhookData) {
  if (webhookData.body.message) {
    if (webhookData.body.message.conversation) {
      return webhookData.body.message.conversation;
    } else if (webhookData.body.message.extendedTextMessage) {
      return webhookData.body.message.extendedTextMessage.text;
    }
  }
  return null; // Retorna null se a mensagem não for encontrada
}

app.post("/api/receber-dados", (req, res) => {
  const webhookData = req.body;
  //.console.log(webhookData);

  if (
    webhookData.body &&
    webhookData.body.key &&
    webhookData.body.pushName &&
    webhookData.body.key.fromMe
  ) {
    const numeroCliente = webhookData.body.key.remoteJid;
    const remetente = webhookData.body.pushName;

    // Extrair a mensagem usando a função
    const mensagem = extrairMensagem(webhookData);
    
    if (mensagem) {
      console.log("Mensagem:", mensagem);

      // const idMensagem = webhookData.body.key.id;
      // const timestampMensagem = webhookData.body.messageTimestamp;

      // Verifique se o cliente já existe
      connection.query(
        "SELECT clienteID FROM Cliente WHERE numero = ?",
        [numeroCliente],
        (err, results) => {
          if (err) {
            console.error("Erro ao verificar se o cliente existe:", err);
          } else {
            if (results.length === 0) {
              // O cliente não existe, então insira as informações
              const tipoRemetente =   
              connection.query(
                "INSERT INTO Cliente (numero, nome_cliente) VALUES (?, ?)",
                [numeroCliente, remetente],
                (err, result) => {
                  if (err) {
                    console.error("Erro ao inserir informações do cliente:", err);
                  } 
                }
                           );
                           } 
//Recupere o ID do cliente 
          connection.query(
            "SELECT clienteID FROM Cliente WHERE numero = ?",
            [numeroCliente],
            (err, results) => {
              if (err) {
                console.error("Erro ao recuperar o ID do cliente:", err);
              } else {
                const clienteId = results[0].clienteID;
                    // Insira a mensagem relacionada ao cliente
                    connection.query(
                      "INSERT INTO Mensagem (conteudo, remetente, tipoRemetente) VALUES ( ?, ?, ?)",
                      [ mensagem, remetente, "Cliente"],
                      (err, result) => {
                        if (err) {
                          console.error("Erro ao inserir a mensagem:", err);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
      );
    } else {
      console.log("Mensagem não encontrada no webhookData.");
    }
  } else {
    console.error("Dados do webhook não possuem informações válidas.");
  }

  res.status(200).send("Dados recebidos com sucesso.");
});

app.get("/api/visualizar-dados", (req, res) => {
  res.status(200).json(webhookData);
});

app.use((req, res) => {
  res.status(404).send("Rota não encontrada.");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
