export default interface fetchOptions {
    method: string;
    body?: string;
    headers: {
        [key: string]: string; // Index signature pour des clés et valeurs dynamiques
    };
}
