/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, createContext, useState } from 'react';
import path from 'path';
import type { NextPage } from 'next';
import _, { constant } from 'lodash';

interface IWallet {
	isConnected: boolean;
}

export const WalletContext = createContext({} as IWallet);

export const WalletProvider: NextPage = function ({ children }) {
	return <WalletContext.Provider value={{ isConnected: false }}>{children}</WalletContext.Provider>;
};
