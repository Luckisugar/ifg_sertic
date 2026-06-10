# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /ABERTURA_CHAMADOS_IFG

# Copiar arquivos essenciais
COPY package.json package-lock.json ./ 
RUN npm install --omit=dev  # Instalar apenas dependências de produção

    
# Copiar código-fonte e construir a aplicação
COPY . . 

# Gera os arquivos do Prisma antes de compilar o projeto
RUN npx prisma generate


RUN npm run build

# Etapa de execução final
FROM node:18-alpine AS runner

WORKDIR /ABERTURA_CHAMADOS_IFG

# Copiar apenas arquivos essenciais do build
COPY --from=builder /ABERTURA_CHAMADOS_IFG/package.json ./ 
COPY --from=builder /ABERTURA_CHAMADOS_IFG/package-lock.json ./ 
COPY --from=builder /ABERTURA_CHAMADOS_IFG/.next .next 
COPY --from=builder /ABERTURA_CHAMADOS_IFG/node_modules node_modules 
COPY --from=builder /ABERTURA_CHAMADOS_IFG/public public 

# Copiar o diretório prisma para dentro do container
COPY --from=builder /ABERTURA_CHAMADOS_IFG/prisma ./prisma 

# Copiar o arquivo de inicialização do Prisma
COPY --from=builder /ABERTURA_CHAMADOS_IFG/lib/prisma.ts ./lib/prisma.ts

EXPOSE 80

