const nodemailer = require("nodemailer");
const configMail = require("../config/mail");
const transporter = nodemailer.createTransport(configMail);

class MailService {
    async sendMail (message) {
        let resultado;
        try {
            resultado = transporter.sendMail({
                ...configMail.default,
                ...message
            });
        } catch (error) {
             console.log(error);
            return error;
        }
        return resultado;
    }

    async sendActivation({ usu_nome, usu_email, usu_chave }) {
        const output = `Olá, ${usu_nome} <br/><br/> Você precisa validar seu cadastro em: <a href="https://psychic-eureka-4j76wx5xxrr2jgjv-3000.app.github.dev/activate/${usu_chave}">Chave</a>`;
        
        try {
            await this.sendMail({
                to: `${usu_nome} <${usu_email}>`,
                subject: "Confirmação de E-mail",
                html: output
            })
        } catch (error) {
            console.log(error);
            return(error);
        }
        return true;
    }
}

module.exports = new MailService();