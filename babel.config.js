module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    [
      'module-name-mapper',
      {
        moduleNameMapper: {
          '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
          '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
        }
      }
    ]
  ]
};
