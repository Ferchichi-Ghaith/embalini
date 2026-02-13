import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { cors } from '@elysiajs/cors'
import { produitController } from '@/back_structure/api_workers/produit/produit.control';
import { BlogsController } from '@/back_structure/api_workers/blog/blog.control';
import { commandController } from '@/back_structure/api_workers/command/command.control';


/**
 * NEXT.JS CONFIGURATION
 * force-dynamic: Disables static generation and layout caching.
 * revalidate = 0: Disables the Data Cache for this route.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

const app = new Elysia({ prefix: '/api' })
  .use(cors())
  // 1. Force headers to prevent browser-side caching
  .onBeforeHandle(({ set }) => {
    set.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
    set.headers['Pragma'] = 'no-cache';
    set.headers['Expires'] = '0';
  })
  .use(swagger({
    path: '/swagger',
    documentation: {
        openapi: '3.0.0', // Explicitly define the OpenAPI version
        info: {
            title: 'Emablini API',
            description: 'Core API services for Emablini marketplace management, including product lifecycle, blogging, and order processing.',
            version: process.env.VERSION || '1.0.0', // Standardized to uppercase ENV
            contact: {
                name: 'API Support',
                email: 'support@emablini.com'
            }
        },
        tags: [
            { name: 'Products', description: 'Management of product catalog and "etat" (condition) status' },
            { name: 'Orders', description: 'Operations for customer commands and fulfillment' },
            { name: 'Blog', description: 'Editorial content and article management' },
           
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    }
}))
  .group(`/v${process.env.version || '1'}`, (v1) => 
    v1
    .use(produitController)
    .use(BlogsController)
    .use(commandController)
  )

console.log(`🚀 Elysia is running with Cache Disabled`);

// Export handlers for all HTTP methods
export const GET = app.fetch 
export const POST = app.fetch 
export const PATCH = app.fetch 
export const PUT = app.fetch
export const DELETE = app.fetch