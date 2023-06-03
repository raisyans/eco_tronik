import Product from "../models/ProductModels.js";
import User from "../models/UserModels.js";
import {Op} from "sequelize";

export const getProducts = async(req, res) => {
try {
    let response;
    if(req.role === "admin"){
        response = await Product.findAll({
            attributes:['uuid','nama','price'],
            include:[{
                model: User,
                attributes:['nama','email']
            }]
        });
    }else{
        response = await Product.findAll({
            attributes:['uuid','nama','price'],
            where:{
                userId: req.userId
            },
            include:[{
                model: User,
                attributes:['nama','email']
            }]
        });
    }
    res.status(200).json(response);
} catch (error) {
    res.status(500).json({mgs: error.message});
    }
}

export const getProductById = async(req, res) => {
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product)return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                attributes:['uuid','nama','price'],
                where:{
                    id: product.id
                },
                include:[{
                    model: User,
                    attributes:['nama','email']
                }]
            });
        }else{
            response = await Product.findOne({
                attributes:['uuid','nama','price'],
                where:{
                [Op.and]:[{id: product.id},{userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['nama','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({mgs: error.message});
        }
}

export const createProducts = async(req, res) => {
    const { nama, price } = req.body;
    try {
        await Product.create({
            nama: nama,
            price: price,
            userId: req.userId
        });
        res.status(201).json({msg: "Product Berhasil dibuat"});
    } catch (error) {
        res.status(500).json({mgs: error.message});
    }

}

export const updateProducts = async(req, res) => {
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product)return res.status(404).json({msg: "Data tidak ditemukan"});
        const { nama, price } = req.body;
        if(req.role === "admin"){
            await Product.update({nama, price},{
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg: "Akses dilarang"});
            await Product.update({nama, price},{
                where:{
                    [Op.and]:[{id: product.id},{userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Product sudah di update"});
    } catch (error) {
        res.status(500).json({mgs: error.message});
        }

}

export const deleteProducts = async(req, res) => {
    try {
        const product = await Product.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product)return res.status(404).json({msg: "Data tidak ditemukan"});
        const { nama, price } = req.body;
        if(req.role === "admin"){
            await Product.destroy({
                where:{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg: "Akses dilarang"});
            await Product.destroy({
                where:{
                    [Op.and]:[{id: product.id},{userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Product sudah di hapus"});
    } catch (error) {
        res.status(500).json({mgs: error.message});
        }

}
