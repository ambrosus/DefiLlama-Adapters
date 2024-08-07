const config = {
  bsc: { factory: '0xd82c03bd0543b567c9cec7b822373be2b167f00f', POOLX: '0xbAeA9aBA1454DF334943951d51116aE342eAB255' },
  base: { factory: '0x7ff9315f538df7ec76ec4815249dd30519726460', },
  arbitrum: { factory: '0x9cfd8c7834be0dfe41f3fe68c29124066d5cd13b', },
  ethereum: { factory: '0x9ff1db30c66cd9d3311b4b22da49791610922b13', },
  manta: { factory: '0x7Ff9315f538dF7eC76Ec4815249Dd30519726460', },
  telos: { factory: '0x2Bb9cFF524C76eb2eA27bC6cDbB93447115D8dcC', },
  polygon: { factory: '0x06fd710fD167f1f08b61e457F41D6e7c7DD9AF3D', },
}

Object.keys(config).forEach(chain => {
  const { factory, POOLX, blacklistedTokens = [], } = config[chain]
  module.exports[chain] = {
    tvl: () => ({}),
    vesting: async (api) => {
      if (POOLX) blacklistedTokens.push(POOLX)
      const tokens = await api.fetchList({ lengthAbi: 'totalVaults', itemAbi: 'vaultIdToTokenAddress', target: factory })
      const vaults = await api.fetchList({ lengthAbi: 'totalVaults', itemAbi: 'vaultIdToVault', target: factory })
      return api.sumTokens({ tokensAndOwners2: [tokens, vaults], blacklistedTokens })
    }
  }
  if (POOLX) module.exports[chain].staking = async (api) => {
    const vaults = await api.fetchList({ lengthAbi: 'totalVaults', itemAbi: 'vaultIdToVault', target: factory })
    return api.sumTokens({ owners: vaults, tokens: [POOLX] })
  }
})