# Toma como base a imagem oficial do Node.js na versão 20.0
FROM node:20

# Cria um diretório de trabalho no container e entra no diretório
WORKDIR /usr/src/app

# Copia todos os arquivos da raíz do projeto na raíz do diretório de trabalho
COPY . .

# Executa comando de instalar as dependências
RUN yarn install

# Expõe a porta 3344 para o lado de fora do container
EXPOSE 3344

# Executa comando de iniciar a aplicação
CMD ["yarn", "start"]
