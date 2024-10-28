import { ChildProcess } from 'child_process'
import { app } from 'electron'
import path from 'path'

export function firstSetup(){
    if (process.argv.length === 1) {
        return false
    }

    const appFolder = path.resolve(process.execPath, '..')
    const rootAtomFolder = path.resolve(appFolder, '..')
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
    const exeName = "Chaotic Capital"

    const spawn = function(command, args) {
        let spawnedProcess

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
        } catch (error) {
            console.warn(error)
        }

        return spawnedProcess
    }

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args)
    }

    const squirrelEvent = process.argv[1]
    switch (squirrelEvent) {
    case '--squirrel-install':
        spawnUpdate(['--createShortcut', exeName])
        setTimeout(app.quit, 1000)
        break
    case '--squirrel-updated':
        spawnUpdate(['--createShortcut', exeName])
        setTimeout(app.quit, 1000)
        break

    case '--squirrel-uninstall':
        spawnUpdate(['--removeShortcut', exeName])

        setTimeout(app.quit, 1000)
        break

    case '--squirrel-obsolete':
        app.quit()
        break
    }
}