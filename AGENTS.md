# Pesquisa do projeto com Graphify

- Para perguntas sobre o código ou a arquitetura deste repositório, consulte primeiro o grafo local com `graphify query "<pergunta>"` quando `graphify-out/graph.json` existir. Use `graphify path` ou `graphify explain` para relações e conceitos específicos.
- Confirme se o índice cobre os arquivos e a revisão atuais. Se estiver ausente ou desatualizado, gere ou atualize o índice local com `graphify extract . --code-only --no-cluster` ou `graphify update .`, sem acionar provedores externos ou indexar dados privados sem autorização específica.
- O índice inicial `--code-only` não cobre toda a documentação, imagens nem necessariamente a semântica do HTML. Para fatos fora da cobertura, consulte os arquivos originais e identifique essa limitação; jamais trate ausência no grafo como ausência no projeto.
- A resposta final deve ser conferida com os arquivos-fonte e testes relevantes. O grafo orienta a pesquisa; não substitui evidência primária, revisão do Git nem as instruções de segurança aplicáveis.
- Esta regra refere-se a pesquisa no repositório. Pesquisas na Web e informações atuais exigem suas próprias fontes.
