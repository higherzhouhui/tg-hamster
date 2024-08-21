import { TonConnectButton } from "@tonconnect/ui-react";
import './index.scss';

export default function () {
    return <header>
        <span>Games</span>
        <TonConnectButton style={{ minWidth: '120px' }} />
    </header>
}
