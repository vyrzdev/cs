export function seek(dir) {
    ws.send(JSON.stringify({ seek: dir }));
}