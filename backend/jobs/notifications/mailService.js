const nodemailer =  require('nodemailer')
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'metadappexchange@gmail.com',
        pass: 'zsmiduxzontjcdyd'
    }
})

const sendDepositEmail = async (amount, coin, toEmail) => {
    const mailDetails = {
        from: 'MetaDapp Exchange <correo>',
        to: toEmail,
        subject: `[MetaDapp] Confirmación de Depósito`,
        html: `<h3><strong>Depositado completado correctamente</strong></h3>
        <p>Tu deposito de ${amount} ${coin.toUpperCase()} 
        ya está disponible en tu cuenta de MetaDapp. 
        <a style="text-decoration: none;" href="http://localhost:3000/wallet/${coin.toLowerCase()}"
         target="_blank" rel="noopener">Comprueba tu balance aquí.</a></p>`
    }

    return await mailTransporter.sendMail(mailDetails)
}

const sendWithdrawEmail = async (amount, coin, toAddress, txId, toEmail) => {
    const mailDetails = {
        from: 'MetaDapp Exchange <correo>',
        to: toEmail,
        subject: `[MetaDapp] Confirmación de Retiro`,
        html: `<h3><strong>Retiro completado correctamente</strong></h3>
        <div>Has realizado una retirada de ${amount} ${coin.toUpperCase()} 
        en tu cuenta de MetaDapp.</div>
        <div>&nbsp;</div>
        <div><strong>Dirección de retiro:</strong> ${toAddress}</div>
        <div><strong>ID de Transacción:</strong> ${txId}</div>`
    }

    return await mailTransporter.sendMail(mailDetails)
}

module.exports = {
    sendDepositEmail,
    sendWithdrawEmail
}