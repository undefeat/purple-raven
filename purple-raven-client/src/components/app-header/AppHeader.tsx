import * as React from 'react';

import './AppHeader.css';
import { AppHeaderProps } from './AppHeaderProps';
import { SETTINGS } from '../../constants';

function AppHeader(props: AppHeaderProps) {
	const { title, showBackBtn, showSettingsBtn } = props;
	const { clear, goBack, openSettings } = props;
	return (
		<header className="app-header-comp">
			{title === SETTINGS &&
				<button
					type="button"
					className="button-backwards ripple"
					title="Back"
					onClick={goBack}
					disabled={!showBackBtn}
				>
					<svg viewBox="0 0 24 24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
					</svg>
				</button>
			}

			{title !== SETTINGS &&
				<button
					type="button"
					className="button-clear ripple"
					title="Clear all messages"
					onClick={clear}
				>
					<svg viewBox="0 0 24 24">
					    <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/>
					    <path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</button>
			}

			<h1>{title}</h1>

			<button
				type="button"
				className="button-channel-add ripple"
				title="Add Channel"
				onClick={openSettings}
				disabled={!showSettingsBtn}
			>
				<svg viewBox="0 0 24 24">
					<path d="M0 0h24v24H0z" fill="none" />
					<path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
				</svg>
			</button>
		</header>
	);
}

export default AppHeader;
