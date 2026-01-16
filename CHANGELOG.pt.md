# Changelog

Todas as alterações significativas deste projeto serão documentadas neste arquivo.

## [5.0.0] - Versão Final (Lançamento)
### Adicionado
- **Modos PDF:** Agora você pode escolher entre exportar em “Modo Claro” (fundo claro) ou “Modo Escuro” (fundo escuro).
- **Upload local:** Opção para fazer upload de uma imagem de capa a partir do PC se o site a bloquear.
- **IU:** Melhorias visuais no assistente, botões de alto contraste para melhor acessibilidade.
- **Estrutura:** Código otimizado e limpeza de estilos CSS.

## [4.5.0] - Navegação fluida
### Adicionado
- **Modo Navegação:** Botão na barra do assistente para pausar a seleção e permitir clicar em links (essencial para passar da capa para o Capítulo 1).
- **Persistência:** O assistente lembra em que etapa você estava, mesmo que você mude de página.

## [4.0.0] - Metadados e Estimativas
### Adicionado
- **Captura Completa:** Suporte para selecionar Imagem da Capa e Sinopse.
- **Algoritmo de Tempo:** Cálculo em tempo real de quanto falta para terminar o download.
- **PDF Profissional:** Nova primeira página no PDF com capa centralizada, estatísticas e sinopse.

## [3.0.0] - Internacionalização (i18n)
### Adicionado
- **Suporte multilíngue:** espanhol, inglês e português.
- Seletor de idioma dinâmico no pop-up.
- Arquivo centralizado `locales.js` para facilitar a tradução.

## [2.0.0] - Otimização do desempenho
### Alterado
- **Motor de scrape:** Substituição de `setTimeout` fixos por `setInterval` dinâmicos.
- **Velocidade:** Detecção instantânea do conteúdo para avançar para o próximo capítulo sem esperas.
- **UX:** Os botões manuais do pop-up foram removidos em favor do “Wizard” (Assistente na página).

## [1.0.0] - Protótipo inicial
- Funcionalidade básica de seleção de elementos (título, conteúdo, botão seguinte).
- Geração básica de PDF com `jsPDF`.
- Armazenamento local no Chrome/Brave Storage.
