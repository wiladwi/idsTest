const Hapi = require('@hapi/hapi')
const mysql = require('mysql')

const server = Hapi.server({
    port:3000,
    host:'localhost'
})

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'db_karyawan'
})

const start = async(err) =>{
    await server.start();
    console.log('server running on %$', server.info.uri)

    con.connect(err =>{
        if(err) throw err
        console.log('database connected')

    })


    
    server.route({
        method:'GET',
        path:'/karyawan',
        handler:async(req,h) =>{
            const data = await getAllData()
            return h.response(data)
        }
    })
    server.route({
        method:'GET',
        path:'/karyawan/{id}',
        handler: async(request, h) =>{
            const data = await getData(request.params.id)
            return h.response(data)
        }
    })
    server.route({
        method:'POST',
        path:'/karyawan',
        options: {
            payload: {
              multipart: true 
            
            }
        },
        handler:async(req,h) =>{
           let data = await postData(req.payload.nama, req.payload.alamat, req.payload.tgl)
            return h.response('data success added')   
        }
    })
    server.route({
        method:'PUT',
        path:'/karyawan/{id}',
        options: {
            payload: {
              multipart: true 
            }
        },
        handler:async(req,h) =>{
            const data = await updateData(req.payload.nama, req.payload.alamat, req.payload.tgl,req.params.id )
            return h.response('data success updated ')
            
        }
    })
    server.route({
        method:'DELETE',
        path:'/karyawan/{id}',
        options: {
            payload: {
              multipart: true 
            }
        },
        handler:async(req,h) =>{
            const data = await deleteData(req.params.id)
            return h.response('data success deleted ')
            
        }
    })





    const getData= (id) =>
    new Promise((resolve, reject) => {
         con.query(`select * from karyawan where id=${id}`,(err,result)=>{
            if(err) throw err
            return resolve(result)
        }) 
    })
    const getAllData= () =>
    new Promise((resolve, reject) => {
         con.query(`select * from karyawan`,(err,result)=>{
             if(err) throw err
            
        }) 
    })
    const updateData= (nama,alamat,tgl,id) =>
     new Promise((resolve, reject) => {
        let sql =`UPDATE karyawan set nama='${nama}', alamat='${alamat}',tgl='${tgl}' where id=${id}`;
            con.query(sql, (err, result) =>{
            if(err) throw err
            return resolve(result)
        })
    })
    const postData=(nama,alamat,tgl) =>
        new Promise((resolve, reject) => {
            let sql =`INSERT INTO karyawan(nama,alamat,tgl) VALUES ('${nama}','${alamat}','${tgl}')`;
               con.query(sql, (err, result) =>{
                if(err) throw err
                return resolve({nama,alamat,tgl})

            })
    })
    const deleteData= (id) =>
    new Promise((resolve, reject) => {
       let sql =`DELETE FROM karyawan  where id=${id}`;
           con.query(sql, (err, result) =>{
           if(err) throw err
           return resolve(result)
       })
   })

}

process.on('unhandleError',(err) =>{
    if(err) throw err
    process.exit(1)
})

start();