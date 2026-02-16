## 🐳 Docker

1. Instalar `docker descktop`
2. Verificar a instalação `docker -v`
3. Ver informações do Docker `docker info`
4. Baixar uma imagem de teste `docker pull hello-world`
5. Rodar um container `docker run hello-world`
6. Listar imagens baixadas `docker images`
7. Ver containers em execução `docker ps`
8. Iniciar um container parado `docker start <container_id>`
9. 9. Utilizando Docker Compose
   - 📄 docker-compose.yml
     - O docker-compose.yml é um arquivo de configuração no formato YAML usado pelo Docker       Compose para definir e gerenciar aplicações com múltiplos containers.
     - Ele permite:
     - Definir serviços (API, banco, etc)
     - Configurar redes
     - Criar volumes
     - 👉 Com um único comando você sobe tudo:
     - `docker compose up -d`
10. Banco de dados PostgreSQL Utilizar a imagem: `bitnami/postgresql`
11. Banco de dados redis Utilizar a imagem: `bitnami/redis`
12. Ver contairnes ativos final `docker ps`


## 📦 Dependencies

1. fastify
2. tsx -D (npx tsx --init)
3. typescript -D
4. @types/node -D
5. @fastify/cors
6. zod
7. fastify-type-provider-zod
8. @fastify/swagger
9. @fastify/swagger-ui
10. @biomejs/biome -D


## ⚙️ Config

1. Configuração de cors, deixando origin: true, em ambiente de dev, para todas urls front usem a api
2. Em produção mudar para a nossa URL do front-end


## 🛡️ Zod

1. import { validatorCompiler, serializerCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
  - validatorCompiler Determina qual que é o formato de entrada de dados em cada rota
  - serializerCompiler E a forma de transformar os dados na hora de enviar ao front-end
  - app.setValidatorCompiler(validatorCompiler);
  - app.setSerializerCompiler(serializerCompiler);
2. Validação automaticamente
3. Tipar o body da nossa requisição post / put
   - Usando o schema
   - Passando o Body 
   - Definindo o z.object
   - E dentro do objeto definimos a tipagem que esparamos receber
   - Na instancia do fastify usamos isso .withTypeProvider<ZodTypeProvider>()


## 🌐 Testing API Routes

1. Baixar a instenção REST Client
2. Exemplo simples de POST
   ```
   POST http://localhost:3333/subscriptions
   Content-Type: application/json

    {
        "name": "Unfast uk",
        "email": "unfastuk123@gmail.com"
   }


## 📃 Doc API com swagger

1. Utilizar o @fastify/swagger e @fastify/swagger-ui
2. Exemplo de uso
```
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { jsonSchemaTransform } from "fastify-type-provider-zod"

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Fastify API",
            description: "API documentation",
            version: "0.1.0"
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, { routePrefix: "/docs" })
```


## Exemplo de rota com fastify + zod

1. no server.ts
   - const app = fastify().withTypeProvider<ZodTypeProvider>()
   - app.register(fastifyCors, { origin: true })
   - app.setValidatorCompiler(validatorCompiler);
   - app.setSerializerCompiler(serializerCompiler);

2. Vincular a rota
   - app.register(subscribeToEventRoute)

3. No arquivo da rota, criar uma função, recebendo um parametro (app), utilizando a tipagem FastifyPluginAsyncZod
   - O Fastify automaticamente:
   - Usa o validatorCompiler (Zod)
   - Usa o serializerCompiler
   - Aplica os tipos no request.body
   - Aplica os tipos no reply
   - ✔️ O que aconteceu foi:
   -   - Você configurou o Fastify globalmente
   -   - A rota recebe esse Fastify já configurado
   -   - Então ela automaticamente ganha tipagem + validação
  
  ```
  
  import { z } from "zod"
  import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

  export const subscribeToEventRoute: FastifyPluginAsyncZod = async (app) => {

    app.post("/subscriptions", {
        schema: {
            summary: "Subscribe to an event",
            tags: ["Subscription"],
            description: "Subscribe to an event",
            body: z.object({
                name: z.string(),
                email: z.email()
            }),
            response: {
                201: z.object({
                    name: z.string(),
                    email: z.email()
                })
            }
        }
    }, async (request, reply) => {
        const { name, email } = request.body

        return reply.status(201).send({ name, email })
    })
  }
  ```

## 🔏 ENV

1. O node por padrão ja consegue ler variáveis de ambiente
   - ```  "dev": "tsx watch --env-file=.env src/server.ts"  ```

2. Criar um arquivo para a validação / criação de schema para as variáveis de ambiente
   - no lugar de ``` app.listen({ port: 3333 }) ```
   - Use ``` app.listen({ port: env.PORT }) ```

```
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333)
})

export const env = envSchema.parse(process.env)
```


## Biomejs 
1. é uma ferramenta de desenvolvimento moderna, rápida e "tudo em um" (all-in-one) projetada para projetos web, funcionando como um substituto de alto desempenho para o ESLint e o Prettier. Escrito em Rust, ele oferece formatação de código e análise estática (linting) para JavaScript, TypeScript, JSX, JSON, CSS e GraphQL com uma velocidade significativamente superior às ferramentas tradicionais baseadas em JavaScript. 
   
2. Instalar a extensão do Biome
3. Baixar a lib em desenvolvimento no projeto ```@biomejs/biome -D```
4. Dentro do Projeto criar uma pasta .vscode
   - um arquivo settings.json
```
{
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  }
}
```

5. Criar um Biome.json
```
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",

   "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },

  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "asNeeded",
      "arrowParentheses": "asNeeded",
      "bracketSpacing": true
    }
  },

  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }

}
```