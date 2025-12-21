import {spawn} from "child_process";
import path from "node:path";

export default async function (link: string, wait: boolean): Promise<string | undefined> {
    let downloadedFilePath = '';
    const ytDlp = spawn("yt-dlp", [
        "-x",
        "--audio-format", "mp3",
        "-o", "./music-files/%(title)s.%(ext)s",
        "--print", "after_move:filepath",
        link
    ]);

    ytDlp.stdout.on("data", (data) => {
        downloadedFilePath = data.toString().trim();
    });

    ytDlp.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    if (!wait) return;

    return new Promise<string>((resolve, reject) => {
        ytDlp.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`yt-dlp exited with code ${code}`));
                return;
            }

            const fileName = path.basename(downloadedFilePath);
            console.log('Downloaded: ' + fileName);
            resolve(fileName);
        });
    });
}
