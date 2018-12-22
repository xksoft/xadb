const debug = require('debug')('adb:client');


const Connection = require('./connection');
const Sync = require('./sync');
const Parser = require('./parser');
const ProcStat = require('./proc/stat');

const HostVersionCommand = require('./command/host/version');
const HostConnectCommand = require('./command/host/connect');
const HostDevicesCommand = require('./command/host/devices');
const HostDevicesWithPathsCommand = require('./command/host/deviceswithpaths');
const HostDisconnectCommand = require('./command/host/disconnect');
const HostTrackDevicesCommand = require('./command/host/trackdevices');
const HostKillCommand = require('./command/host/kill');
const HostTransportCommand = require('./command/host/transport');

const ClearCommand = require('./command/host-transport/clear');
const FrameBufferCommand = require('./command/host-transport/framebuffer');
const GetFeaturesCommand = require('./command/host-transport/getfeatures');
const GetPackagesCommand = require('./command/host-transport/getpackages');
const GetPropertiesCommand = require('./command/host-transport/getproperties');
const InstallCommand = require('./command/host-transport/install');
const IsInstalledCommand = require('./command/host-transport/isinstalled');
const ListReversesCommand = require('./command/host-transport/listreverses');
const LocalCommand = require('./command/host-transport/local');
const LogCommand = require('./command/host-transport/log');
const RebootCommand = require('./command/host-transport/reboot');
const RemountCommand = require('./command/host-transport/remount');
const RootCommand = require('./command/host-transport/root');
const ReverseCommand = require('./command/host-transport/reverse');
const ScreencapCommand = require('./command/host-transport/screencap');
const ShellCommand = require('./command/host-transport/shell');
const StartActivityCommand = require('./command/host-transport/startactivity');
const StartServiceCommand = require('./command/host-transport/startservice');
const SyncCommand = require('./command/host-transport/sync');
const TcpCommand = require('./command/host-transport/tcp');
const TcpIpCommand = require('./command/host-transport/tcpip');
const TrackJdwpCommand = require('./command/host-transport/trackjdwp');
const UninstallCommand = require('./command/host-transport/uninstall');
const UsbCommand = require('./command/host-transport/usb');
const WaitBootCompleteCommand = require('./command/host-transport/waitbootcomplete');

const ForwardCommand = require('./command/host-serial/forward');
const GetDevicePathCommand = require('./command/host-serial/getdevicepath');
const GetSerialNoCommand = require('./command/host-serial/getserialno');
const GetStateCommand = require('./command/host-serial/getstate');
const ListForwardsCommand = require('./command/host-serial/listforwards');
const WaitForDeviceCommand = require('./command/host-serial/waitfordevice');

const TcpUsbServer = require('./tcpusb/server');


export class Client {

    private NoUserOptionError = undefined;
    private options = {port: 5037, bin: 'adb'};

    constructor(options) {
        this.NoUserOptionError = err => err.message.indexOf('--user') !== -1;
        this.options = options;
        if (!this.options.port) {
            this.options.port = 5037
        }
        if (!this.options.bin) {
            this.options.bin = 'adb'
        }
    }

    createTcpUsbBridge(serial: string, options) {
        return new TcpUsbServer(this, serial, options)
    }


    public async connection() {
        let conn: any = await new Promise((resolve, reject) => {
            let my_conn = new Connection(this.options)
                .on('error', (err => reject(err))).on('connect', (() => resolve(my_conn))).connect();
        });
        //移除所有监听器，避免内存泄露
        conn.removeAllListeners();
        return conn;
    }

    public async version() {
        return this.connection()
            .then(conn =>
                new HostVersionCommand(conn)
                    .execute());
    }

    public async connect(host, port = 5555) {
        if (host.indexOf(':') !== -1) {
            [host, port] = Array.from(host.split(':', 2))
        }
        return this.connection()
            .then(conn =>
                new HostConnectCommand(conn)
                    .execute(host, port));
    }

    public async disconnect(host, port = 5555) {
        if (host.indexOf(':') !== -1) {
            [host, port] = Array.from(host.split(':', 2))
        }
        return this.connection()
            .then(conn =>
                new HostDisconnectCommand(conn)
                    .execute(host, port));
    }

    public async listDevices() {
        return this.connection()
            .then(conn =>
                new HostDevicesCommand(conn)
                    .execute());
    }

    public async listDevicesWithPaths() {
        return this.connection()
            .then(conn =>
                new HostDevicesWithPathsCommand(conn)
                    .execute());
    }

    public async trackDevices() {
        return this.connection()
            .then(conn =>
                new HostTrackDevicesCommand(conn)
                    .execute());
    }

    public async kill() {
        return this.connection()
            .then(conn =>
                new HostKillCommand(conn)
                    .execute());
    }

    public async getSerialNo(serial) {
        return this.connection()
            .then(conn =>
                new GetSerialNoCommand(conn)
                    .execute(serial));
    }

    public async getDevicePath(serial) {
        return this.connection()
            .then(conn =>
                new GetDevicePathCommand(conn)
                    .execute(serial));
    }

    public async getState(serial) {
        return this.connection()
            .then(conn =>
                new GetStateCommand(conn)
                    .execute(serial));
    }

    public async getProperties(serial) {
        return this.transport(serial)
            .then(transport =>
                new GetPropertiesCommand(transport)
                    .execute());
    }

    public async getFeatures(serial) {
        return this.transport(serial)
            .then(transport =>
                new GetFeaturesCommand(transport)
                    .execute());
    }

    public async getPackages(serial) {
        return this.transport(serial)
            .then(transport =>
                new GetPackagesCommand(transport)
                    .execute());
    }

    public async getDHCPIpAddress(serial: string, iface = 'wlan0') {
        return this.getProperties(serial)
            .then(function (properties) {
                let ip;
                if (ip = properties[`dhcp.${iface}.ipaddress`]) {
                    return ip
                }
                throw new Error(`Unable to find ipaddress for '${iface}'`)
            })
    }

    public async forward(serial: string, local, remote) {
        return this.connection()
            .then(conn =>
                new ForwardCommand(conn)
                    .execute(serial, local, remote));
    }

    public async listForwards(serial) {
        return this.connection()
            .then(conn =>
                new ListForwardsCommand(conn)
                    .execute(serial));
    }

    public async reverse(serial: string, remote, local) {
        return this.transport(serial)
            .then(transport =>
                new ReverseCommand(transport)
                    .execute(remote, local)
            );
    }

    public async listReverses(serial) {
        return this.transport(serial)
            .then(transport =>
                new ListReversesCommand(transport)
                    .execute());
    }

    public async transport(serial) {
        return this.connection()
            .then(conn =>
                new HostTransportCommand(conn)
                    .execute(serial)
                    .return(conn));
    }

    public async shell(serial: string, command) {
        return this.transport(serial)
            .then(transport =>
                new ShellCommand(transport)
                    .execute(command));
    }

    public async reboot(serial) {
        return this.transport(serial)
            .then(transport =>
                new RebootCommand(transport)
                    .execute());
    }

    public async remount(serial) {
        return this.transport(serial)
            .then(transport =>
                new RemountCommand(transport)
                    .execute());
    }

    public async root(serial) {
        return this.transport(serial)
            .then(transport =>
                new RootCommand(transport)
                    .execute());
    }

    public async trackJdwp(serial) {
        return this.transport(serial)
            .then(transport =>
                new TrackJdwpCommand(transport)
                    .execute());
    }

    public async framebuffer(serial: string, format = 'raw') {
        return this.transport(serial)
            .then(transport =>
                new FrameBufferCommand(transport)
                    .execute(format));
    }

    public async screencap(serial) {
        return this.transport(serial)
            .then(transport => {
                return new ScreencapCommand(transport)
                    .execute()
                    .catch(err => {
                        debug(`Emulating screencap command due to '${err}'`);
                        return this.framebuffer(serial, 'png')
                    })
            });
    }

    public async openLocal(serial: string, path) {
        return this.transport(serial)
            .then(transport =>
                new LocalCommand(transport)
                    .execute(path));
    }

    public async openLog(serial: string, name) {
        return this.transport(serial)
            .then(transport =>
                new LogCommand(transport)
                    .execute(name));
    }

    public async openTcp(serial: string, port, host) {
        return this.transport(serial)
            .then(transport =>
                new TcpCommand(transport)
                    .execute(port, host));
    }


    public async openProcStat(serial) {
        return this.syncService(serial)
            .then(sync => new ProcStat(sync));
    }

    public async clear(serial: string, pkg) {
        return this.transport(serial)
            .then(transport =>
                new ClearCommand(transport)
                    .execute(pkg));
    }

    //安装apk
    public async install(serial: string, apk) {
        let temp = Sync.temp(typeof apk === 'string' ? apk : '_stream.apk');
        let work: any = await new Promise(async (resolve, reject) => {
            let transfer = await this.push(serial, apk, temp);
            transfer.on('error', (err => reject(err)));
            transfer.on('end', (() => resolve(this.installRemote(serial, temp))));
        });
        //移除所有监听器，避免内存泄露
        work.removeAllListeners();
        return work;
    }


    //从远端安装apk
    public async installRemote(serial: string, apk?) {
        return this.transport(serial)
            .then(transport => {
                return new InstallCommand(transport)
                    .execute(apk)
                    .then(() => {
                        return this.shell(serial, ['rm', '-f', apk])
                    })
                    .then(stream =>
                        new Parser(stream)
                            .readAll()).then(out => true)
            });
    }

    public async uninstall(serial: string, pkg) {
        return this.transport(serial)
            .then(transport =>
                new UninstallCommand(transport)
                    .execute(pkg));
    }

    public async isInstalled(serial: string, pkg) {
        return this.transport(serial)
            .then(transport =>
                new IsInstalledCommand(transport)
                    .execute(pkg));
    }

    public async startActivity(serial: string, options) {
        try {
            return this.transport(serial)
                .then(transport =>
                    new StartActivityCommand(transport)
                        .execute(options));
        }
        catch (e) {
            options.user = null;
            return this.startActivity(serial, options)
        }
    }

    public async startService(serial: string, options) {
        try {
            return this.transport(serial)
                .then(function (transport) {
                    if (!options.user && (options.user !== null)) {
                        options.user = 0
                    }
                    return new StartServiceCommand(transport)
                        .execute(options)
                });
        }
        catch (e) {
            options.user = null;
            return this.startService(serial, options)
        }
    }

    public async syncService(serial) {
        return this.transport(serial)
            .then(transport =>
                new SyncCommand(transport)
                    .execute());
    }

    public async stat(serial: string, path) {
        return this.syncService(serial)
            .then(sync =>
                sync.stat(path)
                    .finally(() => sync.end()));
    }

    public async readdir(serial: string, path) {
        return this.syncService(serial)
            .then(sync =>
                sync.readdir(path)
                    .finally(() => sync.end()));
    }

    public async pull(serial: string, path) {
        return this.syncService(serial)
            .then(sync =>
                sync.pull(path)
                    .on('end', () => sync.end()));
    }

    public async push(serial: string, contents, path, mode?) {

        return this.syncService(serial)
            .then(sync =>
                sync.push(contents, path, mode)
                    .on('end', () => sync.end()));
    }

    public async tcpip(serial: string, port = 5555) {
        return this.transport(serial)
            .then(transport =>
                new TcpIpCommand(transport)
                    .execute(port));
    }

    public async usb(serial) {
        return this.transport(serial)
            .then(transport =>
                new UsbCommand(transport)
                    .execute());
    }

    public async waitBootComplete(serial) {
        return this.transport(serial)
            .then(transport =>
                new WaitBootCompleteCommand(transport)
                    .execute());
    }

    public async waitForDevice(serial) {
        return this.connection()
            .then(conn =>
                new WaitForDeviceCommand(conn)
                    .execute(serial));
    }
}



