## 🐳 Docker

1. Instalar docker descktop
2. docker -v
3. docker pull hello-world
4. 4 docker info
5. docker images
6. docker run (image q vc quer usar)
7. docer ps - mostra as imagens que estão rodando no momento
8. 8 docker start


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


## ⚙️ Config

1. Configuração de cors, deixando origin: true, em ambiente de dev, para todas urls front usem a api
2. Em produção mudar para a nossa URL do front-end


## 🛡️ Zod

1. import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"
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
