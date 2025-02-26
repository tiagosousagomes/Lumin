import User, { findOne, find } from "../models/user"; 

const CreateUser = async(req, res, next) =>{
    try{

        // verifica se ja existe o email
        
        const {name, password, username, bio, profilePicture, email} = req.body;
        const existingUser = await findOne({email});
        if(existingUser) {
            return res.status(400).json({
                sucess:false,
                message: "email já em uso"
            })
        }

        // Criar usuario

        const user = new User({name, password, username, bio, profilePicture, email})
        await user.save();

        res.status(201).json({
            sucess: true,
            message:"usuario criado com sucesso",
            data: user
        })

    }catch(err){
     next(err)
    }

    //listar todos os usuarios

const getAllUser = async(req, res, next) =>{
    try{
        const users = await find()
        res.status(201).json({
            sucess:true,
            message: "lista de usuarios:",
            data:users
        })
    }catch(err){
     next(err)
        }
    }}    

  //  listar apenas um usuario

const getOneUser = async(req, res, next) =>{
    try{
        const users = await findOne()
        res.status(201).json({
            sucess:true,
            message: "lista de usuario",
            data:users

        })
    } catch(err){
        next(err)
    }
}

// Atualizar usuario
const updateUser = async(req, res, next) => {
    
}
// deletar usuario