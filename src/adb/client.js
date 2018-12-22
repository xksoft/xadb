"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
class Client {
    constructor(options) {
        this.NoUserOptionError = undefined;
        this.options = { port: 5037, bin: 'adb' };
        this.NoUserOptionError = err => err.message.indexOf('--user') !== -1;
        this.options = options;
        if (!this.options.port) {
            this.options.port = 5037;
        }
        if (!this.options.bin) {
            this.options.bin = 'adb';
        }
    }
    createTcpUsbBridge(serial, options) {
        return new TcpUsbServer(this, serial, options);
    }
    connection() {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield new Promise((resolve, reject) => {
                let my_conn = new Connection(this.options)
                    .on('error', (err => reject(err))).on('connect', (() => resolve(my_conn))).connect();
            });
            conn.removeAllListeners();
            return conn;
        });
    }
    version() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new HostVersionCommand(conn)
                .execute());
        });
    }
    connect(host, port = 5555) {
        return __awaiter(this, void 0, void 0, function* () {
            if (host.indexOf(':') !== -1) {
                [host, port] = Array.from(host.split(':', 2));
            }
            return this.connection()
                .then(conn => new HostConnectCommand(conn)
                .execute(host, port));
        });
    }
    disconnect(host, port = 5555) {
        return __awaiter(this, void 0, void 0, function* () {
            if (host.indexOf(':') !== -1) {
                [host, port] = Array.from(host.split(':', 2));
            }
            return this.connection()
                .then(conn => new HostDisconnectCommand(conn)
                .execute(host, port));
        });
    }
    listDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new HostDevicesCommand(conn)
                .execute());
        });
    }
    listDevicesWithPaths() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new HostDevicesWithPathsCommand(conn)
                .execute());
        });
    }
    trackDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new HostTrackDevicesCommand(conn)
                .execute());
        });
    }
    kill() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new HostKillCommand(conn)
                .execute());
        });
    }
    getSerialNo(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new GetSerialNoCommand(conn)
                .execute(serial));
        });
    }
    getDevicePath(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new GetDevicePathCommand(conn)
                .execute(serial));
        });
    }
    getState(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new GetStateCommand(conn)
                .execute(serial));
        });
    }
    getProperties(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new GetPropertiesCommand(transport)
                .execute());
        });
    }
    getFeatures(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new GetFeaturesCommand(transport)
                .execute());
        });
    }
    getPackages(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new GetPackagesCommand(transport)
                .execute());
        });
    }
    getDHCPIpAddress(serial, iface = 'wlan0') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getProperties(serial)
                .then(function (properties) {
                let ip;
                if (ip = properties[`dhcp.${iface}.ipaddress`]) {
                    return ip;
                }
                throw new Error(`Unable to find ipaddress for '${iface}'`);
            });
        });
    }
    forward(serial, local, remote) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new ForwardCommand(conn)
                .execute(serial, local, remote));
        });
    }
    listForwards(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new ListForwardsCommand(conn)
                .execute(serial));
        });
    }
    reverse(serial, remote, local) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new ReverseCommand(transport)
                .execute(remote, local));
        });
    }
    listReverses(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new ListReversesCommand(transport)
                .execute());
        });
    }
    transport(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new HostTransportCommand(conn)
                .execute(serial)
                .return(conn));
        });
    }
    shell(serial, command) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new ShellCommand(transport)
                .execute(command));
        });
    }
    reboot(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new RebootCommand(transport)
                .execute());
        });
    }
    remount(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new RemountCommand(transport)
                .execute());
        });
    }
    root(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new RootCommand(transport)
                .execute());
        });
    }
    trackJdwp(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new TrackJdwpCommand(transport)
                .execute());
        });
    }
    framebuffer(serial, format = 'raw') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new FrameBufferCommand(transport)
                .execute(format));
        });
    }
    screencap(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => {
                return new ScreencapCommand(transport)
                    .execute()
                    .catch(err => {
                    debug(`Emulating screencap command due to '${err}'`);
                    return this.framebuffer(serial, 'png');
                });
            });
        });
    }
    openLocal(serial, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new LocalCommand(transport)
                .execute(path));
        });
    }
    openLog(serial, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new LogCommand(transport)
                .execute(name));
        });
    }
    openTcp(serial, port, host) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new TcpCommand(transport)
                .execute(port, host));
        });
    }
    openProcStat(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.syncService(serial)
                .then(sync => new ProcStat(sync));
        });
    }
    clear(serial, pkg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new ClearCommand(transport)
                .execute(pkg));
        });
    }
    install(serial, apk) {
        return __awaiter(this, void 0, void 0, function* () {
            let temp = Sync.temp(typeof apk === 'string' ? apk : '_stream.apk');
            let work = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let transfer = yield this.push(serial, apk, temp);
                transfer.on('error', (err => reject(err)));
                transfer.on('end', (() => resolve(this.installRemote(serial, temp))));
            }));
            work.removeAllListeners();
            return work;
        });
    }
    installRemote(serial, apk) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => {
                return new InstallCommand(transport)
                    .execute(apk)
                    .then(() => {
                    return this.shell(serial, ['rm', '-f', apk]);
                })
                    .then(stream => new Parser(stream)
                    .readAll()).then(out => true);
            });
        });
    }
    uninstall(serial, pkg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new UninstallCommand(transport)
                .execute(pkg));
        });
    }
    isInstalled(serial, pkg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new IsInstalledCommand(transport)
                .execute(pkg));
        });
    }
    startActivity(serial, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.transport(serial)
                    .then(transport => new StartActivityCommand(transport)
                    .execute(options));
            }
            catch (e) {
                options.user = null;
                return this.startActivity(serial, options);
            }
        });
    }
    startService(serial, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.transport(serial)
                    .then(function (transport) {
                    if (!options.user && (options.user !== null)) {
                        options.user = 0;
                    }
                    return new StartServiceCommand(transport)
                        .execute(options);
                });
            }
            catch (e) {
                options.user = null;
                return this.startService(serial, options);
            }
        });
    }
    syncService(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new SyncCommand(transport)
                .execute());
        });
    }
    stat(serial, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.syncService(serial)
                .then(sync => sync.stat(path)
                .finally(() => sync.end()));
        });
    }
    readdir(serial, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.syncService(serial)
                .then(sync => sync.readdir(path)
                .finally(() => sync.end()));
        });
    }
    pull(serial, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.syncService(serial)
                .then(sync => sync.pull(path)
                .on('end', () => sync.end()));
        });
    }
    push(serial, contents, path, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.syncService(serial)
                .then(sync => sync.push(contents, path, mode)
                .on('end', () => sync.end()));
        });
    }
    tcpip(serial, port = 5555) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new TcpIpCommand(transport)
                .execute(port));
        });
    }
    usb(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new UsbCommand(transport)
                .execute());
        });
    }
    waitBootComplete(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport(serial)
                .then(transport => new WaitBootCompleteCommand(transport)
                .execute());
        });
    }
    waitForDevice(serial) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection()
                .then(conn => new WaitForDeviceCommand(conn)
                .execute(serial));
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map