import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import vine from '@vinejs/vine'

export default class ProductsController {
    private validationSchema = async function() {
        return vine.compile(
            vine.object({
                name: vine.string().trim().maxLength(100),
                description: vine.string().trim().maxLength(100),
                price: vine.number(),
                stock: vine.number()
            })
        )
    }

    async index({request, response}: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)
        const search = request.input('search', null)
        const products = await Product.query()
            .where((query) => {
                if (search) {
                    query.where('name', 'like', `%${search}%`)
                }
            })
            .paginate(page, limit);
        
        return response.json({
            message: "success",
            data: products.toJSON()
        });
    }

    async create({request, response}: HttpContext) {
        try {
            const data = request.all()
            const payload = (await this.validationSchema()).validate(data)
            const product = await Product.create(await payload);
            
            return response.json({
                message: "success",
                data: product
            });
        } catch (error) {
            return response.badRequest(error.messages)
        }
    }

    async view({params, response}: HttpContext) {
        const id = params.id;
        const product = await Product.findOrFail(id)
        
        return response.json({
            message: "success",
            data: product
        });
    }

    async update({params, request, response}: HttpContext) {
        try {
            const id = params.id;
            const data = request.all()
            const payload = (await this.validationSchema()).validate(data)
            const product = await Product.findOrFail(id)
            product.merge(await payload);
            await product.save();
            
            return response.json({
                message: "success",
                data: product
            });
        } catch (error) {
            return response.badRequest(error.messages)
        }
    }

    async delete({params, response}: HttpContext) {
        const id = params.id;
        const product = await Product.findOrFail(id)
        await product.delete()
        
        return response.json({
            message: "success delete product",
        });
    }
}