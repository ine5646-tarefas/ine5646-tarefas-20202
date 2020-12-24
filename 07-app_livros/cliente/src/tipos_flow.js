//@flow

export type LivroACadastrar = {|
    titulo: string,
    autor: string,
    paginas: number
|}

export type Livro = {|
    _id: string,
    titulo: string,
    autor: string,
    paginas: number
|}

export type RespostaPesquisa = null | Livro | Array<Livro>
