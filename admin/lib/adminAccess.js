export function isAdminReadOnly() {
    return process.env.ADMIN_READ_ONLY === 'true';
}
