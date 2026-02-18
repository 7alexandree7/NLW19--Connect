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
11. ioredis
12. postgres
13. drizzle-orm
14. drizzle-kit -D


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

4. Types 
   - `z.string()` → valida que o valor é uma string
   - `z.number()` → valida que o valor é um número
   - `z.boolean()` → valida true ou false
   - `z.object()` → valida um objeto com estrutura definida
   - `z.array()` → valida uma lista (array) de valores
   - `z.enum()` → valida valores fixos (ex: "admin" | "user")
   - `z.optional()` → torna o campo opcional (pode não existir)
   - `z.nullable()` → permite que o valor seja null
   - `z.nullish()` → permite null ou undefined
   - `z.string().email()` → valida se é um email válido
   - `z.string().url()` → valida se é uma URL válida
   - `z.string().uuid()` → valida se é um UUID válido
   - `z.string().min()/max()` → define tamanho mínimo/máximo de string
   - `z.number().min()/max()` → define valor mínimo/máximo numérico
   - `z.coerce.string()` → converte automaticamente o valor para string antes de validar
   - `z.coerce.number()` → converte automaticamente para número (ex: "10" → 10)
   - `z.coerce.boolean()` → converte valores para boolean (ex: "true" → true)
   - `z.coerce.date()` → converte para Date (ex: string de data → objeto Date)



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
import { z } from 'zod'

const envSchema = z.object({
   PORT: z.coerce.number().default(3333),
   POSTGRES_URL: z.url(),
   REDIS_URL: z.url(),
   WEB_URL: z.url(),
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


## ⚡ Redis

1. Criar uma pasta redis, com um arquivo clinet.ts para fazer a conexãp
2. Instalar a lib ioredis
3. Conexão
4. Metodos
   - `redis.hincrby(...)` 👉 Incrementa um número dentro de um hash no Redis
   - `redis.hget(...)` 👉 Busca o valor de um campo específico dentro de um hash no Redis
   - `redis.zincrby(...)` 👉 Incrementa a pontuação (score) de um membro em um Sorted Set (ranking)
   - `redis.zscore` 👉 Retorna a pontuação (score) atual de um membro dentro do Sorted Set
   - `redis.zrevrank(...)` 👉 Retorna a posição do usuário no ranking (ordem decrescente)
```
import { Redis } from 'ioredis'
import { env } from '../env'

export const redis = new Redis(env.REDIS_URL)

```

## 🐘 PostgreSQL

1. Banco de dados relacional
2. Consultar via SQL
3. porém utilizaremos uma orm chamda drizzle
4. Facilitar as querys no banco, no lugar de escrever sql na mão
5. Conexão via postgres + drizzle (orm)
```
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import { subscriptions } from './schema/subscriptions'

export const pg = postgres(env.POSTGRES_URL)
export const db = drizzle(pg, {
  schema: {
    subscriptions,
  },
})


```



## 🧩 Drizzle

1. é um mapeador objeto-relacional (ORM) leve e moderno, focado em TypeScript e SQL, projetado para ser intuitivo e performático
2. Ele funciona como uma camada fina sobre o banco de dados, permitindo que os desenvolvedores escrevam consultas SQL reais e seguras (type-safe) sem a complexidade de ORMs mais pesados, oferecendo excelente suporte a dialetos como PostgreSQL, MySQL e SQLite. 

3. Criação de Schemas
   - Criar uma pasta Schema e um arquivo para cada tabela
   - Utilizar o `pgTable` para a criação da tabela, definindo um nome como parametro, e um objeto para os elementos da tabela
   - `.uui()` define a coluna como UUID (identificador único).
    - `.primaryKey()` marca essa coluna como chave primária da tabela.
    - `.defaultRandom()` gera automaticamente um UUID aleatório ao inserir um novo registro.
    - `.notNull()` obriga que essa coluna sempre tenha valor (não pode ser null).
   - `.unique()` garante que não existam valores repetidos nessa coluna (ex: e-mail único)
   - `timestamp("created_at")` cria uma coluna de data/hora.
   - `.defaultNow()` define automaticamente a data/hora atual ao criar o registro.


```
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const subscriptions = pgTable('subscriptions', {
   id: uuid('id').primaryKey().defaultRandom(),
   name: text('name').notNull(),
   email: text('email').notNull().unique(),
   createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type Subscription = typeof subscriptions

```

4. Criar realmente a tabela no nosso banco de dados
5. Criar um arquivo na raiz drizzle.config.ts
   - Utilizar o Config do `drizzle-kit` → importa só o tipo de configuração do Drizzle (não vai pro runtime).
   - `import { env }` → importa as variáveis de ambiente (URL do banco).
   - Utilizar um export default passando um objeto com algumas propiedades
      - `schema:`: `"./src/drizzle/schema/*"`  → caminho onde estão os arquivos das tabelas.
      - `out`: `"./src/drizzle/migrations"` → pasta onde serão geradas as migrations.
      - `dialect`: `'postgresql'` → define o banco usado (PostgreSQL).
      - `dbCredentials`: `{ url:  env.POSTGRES_URL}` → garante que o objeto segue o padrão correto do Drizzle.


```
import type { Config } from 'drizzle-kit' 
import { env } from './src/env'

export default {
  schema: './src/drizzle/schema/*',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
} satisfies Config

```

6. Rodar o comando `npx drizzle-kit generate` → gera o arquivo de migration com base nas mudanças do schema.
7. Rodar o comando `npx drizzle-kit migrate`  → aplica as migrations no banco de dados.
8. querys com Drizzle e seus metodos
```
Example Basic query 

    const subscribers = await db.select()
        .from(subscriptions)
        .where(eq(subscriptions.email, email))

```
  - `select()` → Define quais dados/colunas você quer buscar no banco
  - `from()` → Define de qual tabela os dados serão buscados
  - `where()` → Aplica um filtro na consulta
  - `eq()` → Compara se um campo é igual a um valor (= no SQL)

## Funcionalidades da nossa aplicação

1. Criar dentro de src uma pasta functions 
2. Passando o nome de cada funcionalidade 

3. A primeira é a Realização de uma nova inscrição pelo usúario
   - Criar um arquivo chamado `subscribe-to-event-route.ts`
   - Criar uma interface passando o name e email
   - Criar uma função asyncrona passando os parametros e a tipagem
   - Criar uma variavel result, utilizando o await e com o `db` utlizar o `insert` do nosso `subscriptions` q vem do schema, passando os `.values(name, email)`
   - utilizar o returning() para retornar um objeto inteiro

```
import { db } from "../drizzle/client";
import {subscriptions} from "../drizzle/schema/subscriptions"

interface SubscriptionToEventParams {
    name: string;
    email: string;
}

export async function subscribeToEvent({name, email}: SubscriptionToEventParams) {

    const result = await db.insert(subscriptions).values({
        name,
        email
    }).returning()

    const subscriber = result[0]

    return {
        subscriberId: subscriber.id
    }
}
```
   - Chamando na rota de POST de subscription
```
    const {subscriberId } = await subscribeToEvent({name, email})
    return reply.status(201).send({ name, email, subscriberId })

```

4. Segunda funcionalidade é usando o redis, de acesso ao link
   - Quando o usúario se inscrever ele vai ser redirecionado para uma pagina
   - la ele vai ter um link gerado pelo back-end o seu link de convite
   - E nossa função nessa rota é incremetar sempre +1 para o dono do link q foi aberto
   - `const { subscriberId } = request.params` → Pega o ID da URL
   - `await accessInviteLink(...)` → Chama a função que registra o acesso
   - `new URL(env.WEB_URL)` → Cria uma URL base do frontend
   - `url.searchParams.set("referrer", subscriberId)` → Adiciona o ID como query param
   - `reply.redirect(url.toString(), 302)` → Redireciona o usuário (redirect temporário)
   - 🧠 Função accessInviteLink
   -  - `interface AccessInviteLinkParams` → Define o tipo dos parâmetros
   -  - `async function accessInviteLink(...)` → Função que registra o clique no convite
   -  - `redis.hincrby(...)` → Incrementa +1 no contador daquele subscriberId no Redis
   -  - `"referral:access-count"` → Nome da "tabela/hash" no Redis
   -  - `subscriberId` → Campo dentro do hash
   -  - `1` 1 → Incremento de +1
   - 🧩 Resumão geral (nível visão de produto)
   -  - Usuário acessa `/invites/:subscriberId`
   -  - Backend registra +1 acesso no Redis
   -  - Backend redireciona pro front com ?referrer=ID


5. Terceira funcionalidade é buscar quantidade de acessos no link (Redis)
   - Essa funcionalidade serve para mostrar quantas vezes o link de convite foi acessado
   - O backend consulta o Redis e retorna o número de cliques daquele usuário
   - `const { subscriberId } = request.params` → Pega o ID da URL
   - `await getSubscriberInviteLink(...)` → Chama a função que busca os dados no Redis
   - `return { subscriberId, count }` → Retorna o ID + quantidade de acessos
   - 🧩 Resumão geral (nível visão de produto)
   -  - Usuário acessa `/subscribers/:subscriberId/ranking/clicks`
   -  Backend busca no Redis quantos acessos esse link teve
   -  Backend retorna:
   -  - subscriberId
   -  `count` (quantidade de cliques)

6. Quarta funcionalidade é inscrição com sistema de indicação (referrer)
   - Essa funcionalidade permite que um usuário se inscreva usando o link de outra pessoa (indicação)
   - Se houver um `referrer`, o sistema registra isso e aumenta o ranking de quem indicou
   - `const { name, email, referrer } = request.body` → Pega os dados do corpo da requisição
   - `await subscribeToEvent(...)` → Chama a função que cria a inscrição no banco
   - referrer → ID de quem indicou (vem da URL do frontend, tipo ?referrer=ID)
   - `reply.status(201).send(...)` → Retorna o ID do novo inscrito
   - Usuário se inscreve em /subscriptions
   - Pode vir com ?referrer=ID (indicação)
   - Backend cria o usuário no banco
   - Se tiver indicação, soma +1 no ranking do indicador no Redis
   - Backend retorna o subscriberId criado 

7. Quinta funcionalidade é buscar quantidade de convites convertidos (ranking no Redis)
   - Essa funcionalidade serve para mostrar quantas pessoas se cadastraram usando o link de um usuário
   - Aqui usamos um Sorted Set (ranking) no Redis, onde cada usuário tem uma pontuação (score)
   - `const { subscriberId } = request.params` → Pega o ID da URL
   - `await getSubscriberInviteCount(...)` → Chama a função que busca o score no Redis
   - `return { count }` → Retorna a quantidade de convites convertidos
   - 🧠 Função getSubscriberInviteCount
   - → Função que busca o total no ranking
   - `redis.zscore(...)` → Busca a pontuação (score) do usuário no ranking
   - `"referral:ranking"` → Nome do Sorted Set no Redis
   - `subscriberId` → Membro dentro do ranking
   - → `Number.parseInt(count)` → Converte o valor retornado (string) para número
   - Usuário acessa `/subscribers/:subscriberId/ranking/count`
   - Backend consulta o ranking no Redis
   - Backend retorna:
   - count (quantidade de pessoas que se cadastraram com o link dele)


8 Sexta funcionalidade é buscar posição no ranking (Redis)
  - Essa funcionalidade serve para mostrar em qual posição o usuário está no ranking de convites
  - Aqui usamos um Sorted Set (ranking) ordenado do maior para o menor
  - `const { subscriberId } = request.params` → Pega o ID da URL
  - `await getSubscriberRankingPosition(...)` → Chama a função que busca a posição no Redis
  - `return { position }` → Retorna a posição do usuário no ranking
  - `redis.zrevrank(...)` → Retorna a posição do usuário no ranking (ordem decrescente)
  - `"referral:ranking"` → Nome do Sorted Set no Redis
  - `subscriberId `→ Membro dentro do ranking
  - `rank + 1` → Ajusta a posição (Redis começa do 0, então +1)
  - `if (rank == null)` → Se não existir no ranking, retorna posição 0
  - Usuário acessa `/subscribers/:subscriberId/ranking/position
  - Backend consulta o ranking no Redis
  - Backend retorna:
  - `position` (posição do usuário no ranking de convites)