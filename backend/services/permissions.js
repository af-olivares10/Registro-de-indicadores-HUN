const indicatorService = require("../services/indicators");


module.exports = {

    /**
     * Determina si se puede ingresar un valor para indicador en la fecha actual 
     * (Si la fecha actual está incluida en la vigencia del indicador)
     *  
     */
    indicatorRegistryIsEnabled: async function (dbCon, idIndicador, record) {
        const result = await dbCon.query`
        SELECT inicioVigencia, finVigencia FROM INDICADORES 
        WHERE idIndicador = ${idIndicador}
        `;
        
        const isRightAfter = await indicatorService.getCurrentPeriodName(await dbCon, idIndicador, record)
        const currentTime = new Date().getDate()
        if (result.recordset[0] && result.recordset[0].inicioVigencia && result.recordset[0].finVigencia) {
            const time1 = Number.parseInt(result.recordset[0].inicioVigencia)
            const time2 = Number.parseInt(result.recordset[0].finVigencia)
            return currentTime >= time1 && (currentTime <= time2 ) && isRightAfter; // Incluir el último día
        }
        return false

    },

    userCanEditUnit: async function (dbCon, idIndicador, idUsuario) {

        const result = await dbCon.query`
            SELECT INDICADORES.idIndicador, USUARIOS_UNIDADES.idUnidad, USUARIOS_UNIDADES.idUsuario
            FROM INDICADORES 
            INNER JOIN USUARIOS_UNIDADES ON INDICADORES.idUnidad = USUARIOS_UNIDADES.idUnidad 
            WHERE USUARIOS_UNIDADES.idUsuario = ${idUsuario}
            AND INDICADORES.idIndicador = ${idIndicador}
        `;
        return result.recordset[0];
    },

    userCanEditIndicator: async function (dbCon, idIndicador, idUsuario) {
        const result = await dbCon.query`
        SELECT * FROM USUARIOS_INDICADORES 
        WHERE idUsuario = ${idUsuario}
        AND idIndicador = ${idIndicador}
    `;
        return result.recordset[0];

    },
    
    userCanReadUnit: async function (dbCon, idIndicador, idUsuario) {

        const result = await dbCon.query`
            SELECT INDICADORES.idIndicador, USUARIOS_UNIDADES.idUnidad, USUARIOS_UNIDADES.idUsuario
            FROM INDICADORES 
            INNER JOIN USUARIOS_UNIDADES ON INDICADORES.idUnidad = USUARIOS_UNIDADES.idUnidad 
            WHERE USUARIOS_UNIDADES.idUsuario = ${idUsuario}
            AND INDICADORES.idIndicador = ${idIndicador}
        `;
        return result.recordset[0];
    },

    userCanReadIndicator: async function (dbCon, idIndicador, idUsuario) {
        const result = await dbCon.query`
        SELECT * FROM USUARIOS_INDICADORES 
        WHERE idUsuario = ${idUsuario}
        AND idIndicador = ${idIndicador}
    `;
        return result.recordset[0];

    },
    addMultipleUserIndicatorPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let valuesListString = ""
            for (let i = 0; i < data.length; i++) {
                valuesListString += `(${data[i].idUsuario},${data[i].idIndicador})`
                if (i < data.length - 1) {
                    valuesListString += ", "
                }
            }
            const result = (await dbCon.request()
                .query(`insert into USUARIOS_INDICADORES (idUsuario, idIndicador)
            values ${valuesListString}`));
            return result.rowsAffected > 0
        }
        return true
    },

    addMultipleUserUnitPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let valuesListString = ""
            for (let i = 0; i < data.length; i++) {
                valuesListString += `(${data[i].idUsuario},${data[i].idUnidad})`
                if (i < data.length - 1) {
                    valuesListString += ", "
                }
            }
            const result = (await dbCon.request()
                .query(`insert into USUARIOS_UNIDADES (idUsuario, idUnidad)
            values ${valuesListString}`));

            return result.rowsAffected > 0
        }
        return true
    },
    removeMultipleUserIndicatorPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let conditionList = ""
            for (let i = 0; i < data.length; i++) {
                conditionList += `( idUsuario = ${data[i].idUsuario} AND idIndicador = ${data[i].idIndicador})`
                if (i < data.length - 1) {
                    conditionList += "OR "
                }
            }
            const result = (await dbCon.request()
                .query(`
            delete from USUARIOS_INDICADORES 
            where ${conditionList}`));
            return result.rowsAffected > 0
        }
        return true
    },

    removeMultipleUserUnitPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let conditionList = ""
            for (let i = 0; i < data.length; i++) {
                conditionList += `( idUsuario = ${data[i].idUsuario} AND idUnidad = ${data[i].idUnidad})`
                if (i < data.length - 1) {
                    conditionList += "OR "
                }
            }
            const result = (await dbCon.request()
                .query(`
        delete from USUARIOS_UNIDADES 
        where ${conditionList}`));
            return result.rowsAffected > 0
        }
        return true
    },
    addMultipleUserIndicatorReadPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let valuesListString = ""
            for (let i = 0; i < data.length; i++) {
                valuesListString += `(${data[i].idUsuario},${data[i].idIndicador})`
                if (i < data.length - 1) {
                    valuesListString += ", "
                }
            }
            const result = (await dbCon.request()
                .query(`insert into LECT_USUARIOS_INDICADORES (idUsuario, idIndicador)
            values ${valuesListString}`));
            return result.rowsAffected > 0
        }
        return true
    },

    addMultipleUserUnitReadPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let valuesListString = ""
            for (let i = 0; i < data.length; i++) {
                valuesListString += `(${data[i].idUsuario},${data[i].idUnidad})`
                if (i < data.length - 1) {
                    valuesListString += ", "
                }
            }
            const result = (await dbCon.request()
                .query(`insert into LECT_USUARIOS_UNIDADES (idUsuario, idUnidad)
            values ${valuesListString}`));

            return result.rowsAffected > 0
        }
        return true
    },
    removeMultipleUserIndicatorReadPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let conditionList = ""
            for (let i = 0; i < data.length; i++) {
                conditionList += `( idUsuario = ${data[i].idUsuario} AND idIndicador = ${data[i].idIndicador})`
                if (i < data.length - 1) {
                    conditionList += "OR "
                }
            }
            const result = (await dbCon.request()
                .query(`
            delete from LECT_USUARIOS_INDICADORES 
            where ${conditionList}`));
            return result.rowsAffected > 0
        }
        return true
    },

    removeMultipleUserUnitReadPermissions: async function (dbCon, data) {
        if (data.length > 0) {
            let conditionList = ""
            for (let i = 0; i < data.length; i++) {
                conditionList += `( idUsuario = ${data[i].idUsuario} AND idUnidad = ${data[i].idUnidad})`
                if (i < data.length - 1) {
                    conditionList += "OR "
                }
            }
            const result = (await dbCon.request()
                .query(`
        delete from LECT_USUARIOS_UNIDADES 
        where ${conditionList}`));
            return result.rowsAffected > 0
        }
        return true
    },
}