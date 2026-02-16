import fastify from "fastify";
import { fastifyCors } from '@fastify/cors'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { subscribeToEventRoute } from "./routes/subscribe-to-event-route";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { origin: true })

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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
app.register(subscribeToEventRoute)



app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running")
})