export type ProductDataType = {
    id: number
    name: string
    slug: string
    description: string
    price: number
    additional_price?: number
    payment_type: string
    cover_image: string
    created_at: string
    updated_at?: string

    product_features?: {
        id: number
        product_id: number
        name: string
    }[]
}

export type PostDataType = {
    id: number
    title: string
    slug: string
    description?: string
    content: string
    created_at: string
    updated_at?: string
}