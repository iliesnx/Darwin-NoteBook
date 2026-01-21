// This is a mock to satisfy unresolved dependency in Expo Go
// @tensorflow/tfjs-react-native tries to import react-native-fs
// We export dummy functions to prevent crashes.

export const MainBundlePath = '';
export const CachesDirectoryPath = '';
export const DocumentDirectoryPath = '';
export const ExternalDirectoryPath = '';
export const ExternalStorageDirectoryPath = '';
export const TemporaryDirectoryPath = '';
export const LibraryDirectoryPath = '';
export const PicturesDirectoryPath = '';

export function mkdir() { return Promise.resolve(); }
export function moveFile() { return Promise.resolve(); }
export function copyFile() { return Promise.resolve(); }
export function pathForBundle() { return Promise.resolve(); }
export function pathForGroup() { return Promise.resolve(); }
export function getFSInfo() { return Promise.resolve({}); }
export function getAllExternalFilesDirs() { return Promise.resolve([]); }
export function getExtraFileSystemSpace() { return Promise.resolve(0); }
export function downloadFile() { return { jobId: 1, promise: Promise.resolve() }; }
export function stopDownload() { }
export function readFile() { return Promise.resolve(''); }
export function readDir() { return Promise.resolve([]); }
export function readFileAssets() { return Promise.resolve(''); }
export function exists() { return Promise.resolve(false); }
export function existsAssets() { return Promise.resolve(false); }
export function unlink() { return Promise.resolve(); }
export function write() { return Promise.resolve(); }
export function writeFile() { return Promise.resolve(); }
export function appendFile() { return Promise.resolve(); }
export function touch() { return Promise.resolve(); }
export function read() { return Promise.resolve(''); }
export function hash() { return Promise.resolve(''); }

export default {
    MainBundlePath,
    CachesDirectoryPath,
    DocumentDirectoryPath,
    ExternalDirectoryPath,
    ExternalStorageDirectoryPath,
    TemporaryDirectoryPath,
    LibraryDirectoryPath,
    PicturesDirectoryPath,
    mkdir,
    moveFile,
    copyFile,
    pathForBundle,
    pathForGroup,
    getFSInfo,
    getAllExternalFilesDirs,
    getExtraFileSystemSpace,
    downloadFile,
    stopDownload,
    readFile,
    readDir,
    readFileAssets,
    exists,
    existsAssets,
    unlink,
    write,
    writeFile,
    appendFile,
    touch,
    read,
    hash
};
