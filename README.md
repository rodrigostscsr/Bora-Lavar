# BORA LAVAR? – Recomendação de Técnicas para Remoção de Manchas

Aplicação web que sugere como remover manchas de diferentes tecidos, combinando regras pré-definidas com preferências pessoais do usuário (armazenadas localmente). O sistema prioriza as regras locais sobre as padrão, permitindo personalização.

## Funcionalidades

- Seleção de tipo de tecido (Algodão, Malha, Sintético) e tipo de mancha (Gordura, Graxa, Tinta)
- Exibição de recomendações ordenadas: primeiro as regras pessoais (se existirem), depois as regras do sistema
- Cadastro de novas regras personalizadas via formulário
- Persistência das regras criadas no `localStorage`
- Menu flutuante com botões: "Ver Regras", "Adicionar Regra", "Limpar Regras Locais"
- Interface responsiva e feedback visual (cores diferenciadas para regras locais vs. padrão)

## Tecnologias utilizadas

- **HTML5** e **CSS3** (layout flexível, transições)
- **JavaScript (ES6+)** – manipulação de DOM, eventos, `localStorage`
- **Design System** – classes modulares e semânticas

## Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/laundry-helper.git

## Planos futuros
- Utilização da biblioteca React
- Edição de regras locais
- Implementação de mais regras do servidor
- Opção de configuração do usuário para ordenação de regras
- Exclusão de regras locais individuais