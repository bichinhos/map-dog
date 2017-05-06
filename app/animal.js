// Dependencies
var mongoose = require('mongoose');
var Animal = require('./models/animal.js')
var User = require('./models/user.js')
var Notificacao = require('./models/notificacao.js')
var Schema = mongoose.Schema
var request = require('request')
var fs = require('fs')
var multer = require('multer')
var notificacao = require('./notificacao.js')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

var upload = multer({
    storage: storage
})

//GET /animais
exports.ConsultarAnimais = (req, res) => {

    // Uses Mongoose schema to run the search (empty conditions)
    var query = Animal.find({});
    query.exec(function(err, animals) {
        if (err) res.json({
            status: 500,
            message: 'Ocorreu um erro, tente novamente.'
        })
        else {
            // If no errors are found, it responds with a JSON of all users
            res.json(animals);
        }
    })  
}

//GET /animal/:id
exports.ConsultarAnimal = (req, res) => {
    Animal.findById(req.params.id, (err, _animal) => {
        if (err) res.json({
            status: 500,
            message: err
        })

        // res.render('pages/animal', { animal: _animal})
        res.json(_animal)
    })
}

//POST /animal
exports.AdicionarAnimal = (req, res, next) => {
    let notificacaoOpts = {
        from: 'Bichinhos',
        to: '',
        subject: 'Um novo bichinho foi adicionado.',
        text: ''
    }

    console.log(req.body.animal)

    var newAnimal = Animal({
        tipo: req.body.tipo,
        cor: req.body.cor,
        porte: req.body.porte,
        genero: req.body.genero,
        idade: req.body.idade,
        descricao: req.body.descricao,
        localizacao: [req.body.lng, req.body.lat],
        img: {
            data: req.file.filename
        }
    })

    newAnimal.save((err, animal) => {
        if (err) res.json({
            status: 500,
            message: err
        })

        Animal.findById(animal, (err, doc) => {
            if (err) return next(err)
            console.log('Animal', doc)
            User.findById(req.user._id, (err, user) => {
                for (var i = 0; i < user.local.subscribers.length; i++) {
                    notificacaoOpts.to = user.local.subscribers[i].email
                    notificacaoOpts.html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE"><title>Template Base</title><style id="media-query">/* Client-specific Styles & Reset */ #outlook a { padding: 0; } /* .ExternalClass applies to Outlook.com (the artist formerly known as Hotmail) */ .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } #backgroundTable { margin: 0; padding: 0; width: 100% !important; line-height: 100% !important; } /* Buttons */ .button a { display: inline-block; text-decoration: none; -webkit-text-size-adjust: none; text-align: center; } .button a div { text-align: center !important; } /* Outlook First */ body.outlook p { display: inline !important; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; } /*  Media Queries */ @media only screen and (max-width: 500px) { table[class="body"] img { height: auto !important; width: 100% !important; } table[class="body"] img.fullwidth { max-width: 100% !important; } table[class="body"] center { min-width: 0 !important; } table[class="body"] .container { width: 95% !important; } table[class="body"] .row { width: 100% !important; display: block !important; } table[class="body"] .wrapper { display: block !important; padding-right: 0 !important; } table[class="body"] .columns, table[class="body"] .column { table-layout: fixed !important; float: none !important; width: 100% !important; padding-right: 0px !important; padding-left: 0px !important; display: block !important; } table[class="body"] .wrapper.first .columns, table[class="body"] .wrapper.first .column { display: table !important; } table[class="body"] table.columns td, table[class="body"] table.column td, .col { width: 100% !important; } table[class="body"] table.columns td.expander { width: 1px !important; } table[class="body"] .right-text-pad, table[class="body"] .text-pad-right { padding-left: 10px !important; } table[class="body"] .left-text-pad, table[class="body"] .text-pad-left { padding-right: 10px !important; } table[class="body"] .hide-for-small, table[class="body"] .show-for-desktop { display: none !important; } table[class="body"] .show-for-small, table[class="body"] .hide-for-desktop { display: inherit !important; } .mixed-two-up .col { width: 100% !important; } }  @media screen and (max-width: 500px) { div[class="col"] { width: 100% !important; } } @media screen and (min-width: 501px) { table[class="container"] { width: 500px !important; } }</style></head><body style="width: 100% !important;min-width: 100%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100% !important;margin: 0;padding: 0;background-color: #FFFFFF"><table cellpadding="0" cellspacing="0" width="100%" class="body" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;height: 100%;width: 100%;table-layout: fixed"><tbody><tr style="vertical-align: top"><td class="center" align="center" valign="top" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;text-align: center;background-color: #FFFFFF"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent"><!--[if gte mso 9]><table id="outlookholder" border="0" cellspacing="0" cellpadding="0" align="center"><tr><td><![endif]--><!--[if (IE)]><table width="500" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" class="container" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;max-width: 500px;margin: 0 auto;text-align: inherit"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent" class="block-grid " style="border-spacing: 0;border-collapse: collapse;vertical-align: top;width: 100%;max-width: 500px;color: #000000;background-color: transparent"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;text-align: center;font-size: 0"><!--[if (gte mso 9)|(IE)]><table width="100%" align="center" bgcolor="transparent" cellpadding="0" cellspacing="0" border="0"><tr><![endif]--><!--[if (gte mso 9)|(IE)]><td valign="top" width="500" style="width:500px;"><![endif]--><div class="col num12" style="display: inline-block;vertical-align: top;width: 100%"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;padding-top: 5px;padding-right: 0px;padding-bottom: 5px;padding-left: 0px;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent"><table cellpadding="0" cellspacing="0" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;width: 100%"><div align="center" style="font-size:12px"><img class="center fullwidth" align="center" border="0" src="https://pro-bee-user-content-eu-west-1.s3.amazonaws.com/public/users/BeeFree/bceb12da-0716-43cf-8fdf-78d31e2b18ad/logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: 0;height: auto;line-height: 100%;margin: 0 auto;float: none;width: 100% !important;max-width: 500px" width="500"></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if (gte mso 9)|(IE)]></td><![endif]--><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table><!--[if mso]></td></tr></table><![endif]--><!--[if (IE)]></td></tr></table><![endif]--></td></tr></tbody></table><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent"><!--[if gte mso 9]><table id="outlookholder" border="0" cellspacing="0" cellpadding="0" align="center"><tr><td><![endif]--><!--[if (IE)]><table width="500" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" class="container" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;max-width: 500px;margin: 0 auto;text-align: inherit"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent" class="block-grid " style="border-spacing: 0;border-collapse: collapse;vertical-align: top;width: 100%;max-width: 500px;color: #000000;background-color: transparent"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;text-align: center;font-size: 0"><!--[if (gte mso 9)|(IE)]><table width="100%" align="center" bgcolor="transparent" cellpadding="0" cellspacing="0" border="0"><tr><![endif]--><!--[if (gte mso 9)|(IE)]><td valign="top" width="500" style="width:500px;"><![endif]--><div class="col num12" style="display: inline-block;vertical-align: top;width: 100%"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent"><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-top: 10px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px"><div style="height: 10px;"><table align="center" border="0" cellspacing="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;border-top: 10px solid transparent;width: 100%"><tbody><tr style="vertical-align: top"><td align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"/></tr></tbody></table></div></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;width: 100%;padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px"><div align="center" style="font-size:12px"><a href="https://beefree.io" target="_blank"><img class="center fullwidth" align="center" border="0" src="https://pro-bee-user-content-eu-west-1.s3.amazonaws.com/public/users/BeeFree/bceb12da-0716-43cf-8fdf-78d31e2b18ad/2.jpeg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: none;height: auto;line-height: 100%;margin: 0 auto;float: none;width: 100% !important;max-width: 500px" width="500"></a></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if (gte mso 9)|(IE)]></td><![endif]--><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table><!--[if mso]></td></tr></table><![endif]--><!--[if (IE)]></td></tr></table><![endif]--></td></tr></tbody></table><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent"><!--[if gte mso 9]><table id="outlookholder" border="0" cellspacing="0" cellpadding="0" align="center"><tr><td><![endif]--><!--[if (IE)]><table width="500" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" class="container" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;max-width: 500px;margin: 0 auto;text-align: inherit"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent" class="block-grid " style="border-spacing: 0;border-collapse: collapse;vertical-align: top;width: 100%;max-width: 500px;color: #333;background-color: transparent"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;text-align: center;font-size: 0"><!--[if (gte mso 9)|(IE)]><table width="100%" align="center" bgcolor="transparent" cellpadding="0" cellspacing="0" border="0"><tr><![endif]--><!--[if (gte mso 9)|(IE)]><td valign="top" width="500" style="width:500px;"><![endif]--><div class="col num12" style="display: inline-block;vertical-align: top;width: 100%"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;padding-top: 30px;padding-right: 0px;padding-bottom: 30px;padding-left: 0px;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent"><table cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-top: 25px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px"><div style="color:#ffffff;line-height:120%;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><div style="font-size:12px;line-height:14px;color:#ffffff;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 18px;line-height: 22px;text-align: center"><span style="font-size: 24px; line-height: 28px; color: rgb(86, 107, 120);"><strong>Olá, ' + user.local.subscribers[i].nome + '</strong></span></p></div></div></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-top: 0px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px"><div style="color:#B8B8C0;line-height:150%;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><div style="font-size:12px;line-height:18px;color:#B8B8C0;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center"><span style="font-size: 16px; line-height: 24px; color: rgb(86, 107, 120);">Estamos passando para informar que adicionamos um novo bichinho, esperamos que você possa ajudar ele :)</span></p></div></div></td></tr></tbody></table><table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td class="button-container" align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-top: 15px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td width="100%" class="button" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:38px;   v-text-anchor:middle; width:194px;" arcsize="66%"   strokecolor="#566b78"   fillcolor="#566b78" ><w:anchorlock/><center style="color:#ffffff; font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif; font-size:16px;"><![endif]--><!--[if !mso]><!-- --><div align="center" style="display: inline-block; border-radius: 25px; -webkit-border-radius: 25px; -moz-border-radius: 25px; max-width: 35%; width: 100%; border-top: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;height: 38"><tbody><tr style="vertical-align: top"><td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;border-radius: 25px; -webkit-border-radius: 25px; -moz-border-radius: 25px; color: #ffffff; background-color: #566b78; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align: center"><!--<![endif]--><a href="" target="_blank" style="display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;background-color: #566b78;color: #ffffff"><a href="https://sos-animals.herokuapp.com/animal/' + doc._id + '" style="display:inline-block;text-decoration:none;text-align:center;background-color:#566b78;color:#ffffff" target="_blank"> <span style="line-height:24px;font-size:12px"><span style="font-size:14px;line-height:28px">Me leve ao bichinho</span></span></a></a><!--[if !mso]><!-- --></td></tr></tbody></table></div><!--<![endif]--><!--[if mso]></center></v:roundrect><![endif]--></td></tr></tbody></table></td></tr></tbody></table><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-top: 10px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px"><div style="height: 0px;"><table align="center" border="0" cellspacing="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;border-top: 0px solid transparent;width: 100%"><tbody><tr style="vertical-align: top"><td align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"/></tr></tbody></table></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if (gte mso 9)|(IE)]></td><![endif]--><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table><!--[if mso]></td></tr></table><![endif]--><!--[if (IE)]></td></tr></table><![endif]--></td></tr></tbody></table><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: #ffffff"><!--[if gte mso 9]><table id="outlookholder" border="0" cellspacing="0" cellpadding="0" align="center"><tr><td><![endif]--><!--[if (IE)]><table width="500" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" class="container" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;max-width: 500px;margin: 0 auto;text-align: inherit"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent" class="block-grid " style="border-spacing: 0;border-collapse: collapse;vertical-align: top;width: 100%;max-width: 500px;color: #333;background-color: transparent"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;text-align: center;font-size: 0"><!--[if (gte mso 9)|(IE)]><table width="100%" align="center" bgcolor="transparent" cellpadding="0" cellspacing="0" border="0"><tr><![endif]--><!--[if (gte mso 9)|(IE)]><td valign="top" width="500" style="width:500px;"><![endif]--><div class="col num12" style="display: inline-block;vertical-align: top;width: 100%"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;padding-top: 30px;padding-right: 0px;padding-bottom: 30px;padding-left: 0px;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="center" valign="top" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table border="0" cellspacing="0" cellpadding="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="center" valign="top" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;text-align: center;padding-top: 10px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px;max-width: 151px"><!--[if (gte mso 9)|(IE)]><table width="141" align="left" border="0" cellspacing="0" cellpadding="0"><tr><td align="left"><![endif]--><table width="100%" align="left" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table align="left" border="0" cellspacing="0" cellpadding="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;padding: 0 5px 0 0" height="37"><tbody><tr style="vertical-align: top"><td width="37" align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><a href="https://www.facebook.com/" title="Facebook" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: none;height: auto;line-height: 100%;max-width: 32px !important"></a></td></tr></tbody></table><table align="left" border="0" cellspacing="0" cellpadding="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;padding: 0 5px 0 0" height="37"><tbody><tr style="vertical-align: top"><td width="37" align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><a href="http://twitter.com/" title="Twitter" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: none;height: auto;line-height: 100%;max-width: 32px !important"></a></td></tr></tbody></table><table align="left" border="0" cellspacing="0" cellpadding="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;padding: 0 5px 0 0" height="37"><tbody><tr style="vertical-align: top"><td width="37" align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><a href="http://plus.google.com/" title="Google+" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/googleplus.png" alt="Google+" title="Google+" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: none;height: auto;line-height: 100%;max-width: 32px !important"></a></td></tr></tbody></table></td></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table><table cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-top: 15px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px"><div style="color:#959595;line-height:150%;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><div style="font-size:12px;line-height:18px;text-align:center;color:#959595;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><p style="margin: 0;font-size: 12px;line-height: 18px;text-align: center">Essa é uma mensagem enviada automaticamente, não é necessário responder ela.</p></div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if (gte mso 9)|(IE)]></td><![endif]--><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table><!--[if mso]></td></tr></table><![endif]--><!--[if (IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></body></html>'
                    notificacao.notificar_email(notificacaoOpts)

                    AdicionarNotificacao({
                        email: req.user.local.email,
                        animal_id: doc._id
                    }, (result) => {
                        console.log(result)
                    })
                }
                res.json({
                    status: 200
                })
            })
        })
    })
}

// route middleware to make sure a user is logged in
exports.estaLogado = (req, res, next) => {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

var AdicionarNotificacao = (opts, callback) => {
    var novaNotificacao = new Notificacao()

    novaNotificacao.usuario = opts.email
    novaNotificacao.mensagem = 'https://sos-animals.herokuapp.com/animal/' + opts.animal_id

    novaNotificacao.save((err, doc) => {
        if (err) console.error(err)
    })
}