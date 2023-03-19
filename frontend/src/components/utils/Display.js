const getDisplayableTxHash = (txHash) => {
    return `${txHash.slice(0, 15)}...`
}

const getDisplayableAddress = (address) => {
    return `${address.slice(0, 12)}...${address.slice(-12)}`
}

// 1. Aprobando, 2. Procesando, 3. Procesado, 4. Cancelado
const getStatusName = (code) => {
    return {
        0: 'Pendiente',
        1: 'Aprobando',
        2: 'Procesando',
        3: 'Completado',
        4: 'Cancelado'
    }[code]
}

export {
    getDisplayableTxHash,
    getDisplayableAddress,
    getStatusName
}