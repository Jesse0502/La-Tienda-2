import { ProductInterface } from "../../../store/productSlice";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function getAllProducts(){
    const products = await stripe.products.list();
    const sendProducts: ProductInterface[] = []
    products.data.forEach((p: any) => {
        if(p?.default_price){
            let price = null;
            if(p.id === "prod_MFn5pAD2FrjPJf") price = 1.99
            if (p.id === "prod_MFn3ecLwJrYVLa") price = 5.00
            if (p.id === "prod_MFmyvIkVjSbrle") price = 109.99
            
            sendProducts.push({
                id: p.id,
                description: p.description,
                images: p.images,
                name: p.name,
                default_price: p.default_price,
                cost: price as number
            })
        }
    })
    return sendProducts
}

export default async function handler(req: any, res: any){
    if(req.method === "GET"){
        try{

            const sendProducts: ProductInterface[] = await getAllProducts()
            
            res.status(200).json(sendProducts);
        } catch(err: any){
            console.log(err.message)
        }
    } else {
        res.status(400).json({error: "Method now allowed!"});
    }
}