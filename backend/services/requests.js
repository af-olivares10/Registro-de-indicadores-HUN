const moment = require("moment")

module.exports = {

    getRequestsByUser: async function (dbCon, idUsuario) {
        const result = await dbCon.query`
        select INDICADORES.nombre as indicador, UNIDADES.nombre as unidad, SOLICITUDES.fecha as fechaSolicitud,
        ESTADOS.nombre as estado,  accesos.fechaInicio as inicioAcceso, accesos.fechaFin as finAcceso 
        from SOLICITUDES
        inner join INDICADORES on INDICADORES.idIndicador = SOLICITUDES.idIndicador
        inner join ESTADOS on ESTADOS.idEstado = SOLICITUDES.idEstado
        inner join UNIDADES on UNIDADES.idUnidad = INDICADORES.idUnidad
        left join ACCESOS on ACCESOS.idSolicitud = SOLICITUDES.idSolicitud
        where idSolicitante = ${idUsuario}
        `;
        return result.recordset;
    },

    updateRequest: async function (dbCon, idSolicitud, approved) {
        const state = approved ? "APROBADA" : "RECHAZADA"
        const idEstado = (await dbCon.query`
        select idEstado from estados 
        where nombre = ${state}
        `).recordset[0].idEstado;

        const result = await dbCon.query`
            update SOLICITUDES
            set idEstado = ${idEstado}
            where idSolicitud = ${idSolicitud}
        `;
        return result.recordset;
    },
    getRequestsOnhold: async function (dbCon, request) {
        const result = await dbCon.query`
            select SOLICITUDES.* from SOLICITUDES 
            inner join ESTADOS 
            ON ESTADOS.idEstado = SOLICITUDES.idEstado 
            where ESTADOS.nombre = 'EN ESPERA'
                `;
        return result.recordset;
    },
    requestExists: async function (dbCon, request) {
        const {
            idSolicitante,
            idIndicador,
        } = request;
        const result = await dbCon.query`
            select * from SOLICITUDES 
            inner join ESTADOS 
            ON ESTADOS.idEstado = SOLICITUDES.idEstado 
            where SOLICITUDES.idSolicitante = ${idSolicitante}
            and SOLICITUDES.idIndicador = ${idIndicador}
            and ESTADOS.nombre = 'EN ESPERA'
                `;
        return result.recordset[0];
    },

    postRequest: async function (dbCon, request) {
        const {
            idSolicitante,
            idIndicador,
            comentario,
        } = request;
        const requestIsInDb = await this.requestExists(dbCon, request)
        if (!requestIsInDb) {
            const idEstado = (await dbCon.query`
        select idEstado from estados 
        where nombre = 'EN ESPERA'
        `).recordset[0].idEstado;

            const newLocal = moment().format();
            const result = await dbCon.query`
            insert into SOLICITUDES (
                idSolicitante, 
                idIndicador, 
                idEstado, 
                fecha, 
                comentario
                )
            values (
                ${idSolicitante},
                ${idIndicador},
                ${idEstado},
                ${newLocal},
                ${comentario}
                )`;
            return {
                success: true,
                message: "Solicitud registrada!"
            }
        }
        else return {
            success: false,
            message: `Usted ya había ingresado una solicitud para este indicador en las fechas ${requestIsInDb.fechaInicio} y ${requestIsInDb.fechaFin}. `
        }
    },

    getUsersAndIndicatorsWithRequestsOnHold: async function (dbCon, idEstado) {
        const result = await dbCon.query`
            select * from SOLICITUDES 
            inner join USUARIOS 
            ON USUARIOS.idUsuario = SOLICITUDES.idSolicitante 
            inner join INDICADORES
            ON INDICADORES.idIndicador = SOLICITUDES.idIndicador
            where SOLICITUDES.idEstado = ${idEstado}
            `;
        return result.recordset;
    },

    getRequestsHistory: async function (dbCon) {
        const result = await dbCon.query`
            SELECT 
                SOLICITUDES.idSolicitud,
                fechaInicio,
                fechaFin,
                USUARIOS.nombre as username, 
                USUARIOS.apellidos as lastname,
                USUARIOS.username as cedula,
                INDICADORES.nombre as indicator, 
                responsableDelIndicador, 
                comentario,
                ESTADOS.nombre as estado,
                fecha 
            FROM SOLICITUDES 
            INNER JOIN USUARIOS ON SOLICITUDES.idSolicitante = USUARIOS.idUsuario
            INNER JOIN INDICADORES ON SOLICITUDES.idIndicador = INDICADORES.idIndicador
            INNER JOIN ESTADOS ON SOLICITUDES.idEstado = ESTADOS.idEstado
            LEFT JOIN ACCESOS ON SOLICITUDES.idSolicitud = ACCESOS.idSolicitud
        `;
        return result.recordset;
    },

}