const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public', 'css')));

app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'views', 'index.html');
    const jsonPath = path.join(__dirname, 'public', 'data', 'lanches.json');

    const html = fs.readFileSync(htmlPath, 'utf-8');
    const lanches = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const listaLanches = lanches.map(lanche => `
      <li onclick="toggleIngredientes(${lanche.id})">
        <p>${lanche.nome}</p>
        <p id="ingredientes-${lanche.id}" style="display: none; margin: 20px;">
          ${lanche.ingredientes}
        </p>
      </li>
    `).join('\n');
    const htmlFinal = html.replace('<!-- LANCHES -->', listaLanches);

    res.send(htmlFinal);
});

app.get('/contato', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.post('/contato', (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;

  res.send(`
    <html>
      <head>
        <title>Contato Recebido</title>
        <link rel="stylesheet" href="/contato.css" />
      </head>
      <body>
        <section class="contato-enviado">
          <div class="container_contato-enviado">
            <h1>Obrigado pelo contato, ${nome}!</h1>
            <p>Email: ${email}</p>
            <p>Assunto: ${assunto}</p>
            <p>Mensagem: ${mensagem}</p>
            <button type="button" onclick="window.location.href='/'">Voltar para a página inicial</button>
          </div>
        </section>
      </body>
    </html>
  `);
});

app.get('/sugestao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sugestao.html'));
});

app.get('/api/lanches', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'lanches.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao ler os dados.' });
    }
    res.json(JSON.parse(data));
  });
});

// Tratamento para caso não encontre a rota 
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
