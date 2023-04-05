const {object, string, mixed} = require("yup");
const { apiEndpoints } = require ("../../api/index");
const MailServices = require("../../services/mail");
const fs = require("fs");
const { uploadFolder } = require("../../config/upload")

const criarChave = (n, r = "") => {
    while(n--)
    r+= String.fromCharCode(
        ((r = (Math.random() *62) | 0)
        (r += r > 9 ? (r < 36 ? 55 : 61) : 48))
    );

    return r;
};

class Usuarios {
    async store(req, res, next) {
        let usuarioSchema = object({
            usu_nome: string().required("Entre com o nome de usuário"),
            usu_email: string().email("Entre com um e-mail válido").required("Entre com o e-mail"),
            usu_senha: string()
      .required('Entre com a senha')
        .matches(
         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
         "A senha precisa ter no mínimo 6 caracteres, sendo, uma maiúsculas, uma minúscula, um número e um caracter especial"),
            usu_nivel: mixed().oneOf(["admin", "comum"], "Tipo de usuário inválido")
        })

        !req.body?.usu_nivel && (req.body = {...req.body, usu_nivel: "comum" });
        !req.body?.usu_celular && (req.body = {...req.body, usu_celular: "" });
        !req.body?.usu_cpf && (req.body = {...req.body, usu_cpf: "" });

        const usu_chave = criarChave(10);
        const { usu_nome, usu_email } =req.body;
        await MailServices.sendActivation({
            usu_nome,
            usu_email,
            usu_chave
        });

        req.body = {
            ...req.body,
            usu_foto: "",
            usu_chave: usu_chave,
            usuemailconfirmado: false,
            usucadastroativo: false,
            created_at: new Date(),
            updated_at: ""
        };


        try {
            await usuarioSchema.validate(req.body);
        } catch (error) {
            return res.status(400).end({error: error.message});
        }

        const usuario = apiEndpoints.db
         .get("usuarios")
         .find({usu_email: req.body.usu_email})
         .cloneDeep()
         .value();

       if (usuario) {
           return res.status(400).send({error: "Usuário já cadastrado"}).end();
       }


        let usuarioFinded = apiEndpoints.db
        .get("usuarios")
        .find({usu_email: req.body.usu_email})
        .value();

        if (usuarioFinded) {
            return res.status(400).end({error: "Usuário já cadastrado"});
        }

        next();
    }

    async update(req, res, next) {
        req.body = {...req.body, updated_at: new Date() };
        next();
    }

    async activate(req, res, next) {
        const { chave } = req.params;

        let usuario = apiEndpoints.db
        .get("usuarios")
        .find({usu_chave: chave})
        .value();

        if (!usuario) {
            return res.status(400).send({ error: "key not finded" }).end();
        }
        usuario.usu_chave = "";
        usuario.usucadastroativo = true;
        usuario.usuemailconfirmado = true;
        apiEndpoints.db.write();

        return res.status(200).send({ response: "User activated" }).end();
    }

    async uploadPhoto (req, res, next) {
        const { id } = req.params;
        const avatar = req.file;

        let usuario = await apiEndpoints.db
        .get ("usuarios")
        .find ( { id: parseInt(id, 10)} )
        .value();

        if (!usuario) res.status(400).send({error: "id not found"}).end();

        if (usuario.usu_foto !== "")
        try { 
            fs.unlinkSync(`${uploadFolder}/${usuario.usu_foto}`);
        } catch (error) {
            console.log(`Erro ao excluir o arquivo ${uploadFolder}/${usuario.usu_foto}`);
        }

        usuario.usu_foto = avatar.filename;
        usuario.usu_updated_at = new Date();
        apiEndpoints.db.write();

        let output = Object.assign({}, usuario);
        delete output.usu_senha;

        return res
        .status(200)
        .send({ ...output })
        .end();
    }

}


module.exports = new Usuarios();