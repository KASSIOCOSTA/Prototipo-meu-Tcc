function Login(){
    return(
        <main className="min-h-screen bg-[#fff8fa] flex items-center justify-center px-4">
            <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#6c233d]">
                        Nosso presente
                    </h1>
                    <p className="mt-2 text-gray-500 ">
                        Crie experiências especias para acompanhar seus presentes
                    </p>
                </div>

                <form className="space-y-5">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">E-mail</label>
                        <input type="email" id="email" placeholder="Digite seu e-mail" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6c233d] focus:ring-2 focus:ring-[#6c233d]/20" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                        <input type="password" id="password" placeholder="Digite sua senha" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6c233d] focus:ring-2 focus:ring-[#6c233d]/20" />
                    </div>

                    <button type="submit" className="w-full rounded-lg bg-[#6c233d] py-3 font-semibold text-white transition hover:bg-[#8a3455]">Entrar</button>

                </form>

                <div className="mt-6 text-center text-sm">
                    <a href="#" className="text-[#6c233d] hover:underline">Esqueci minha senha</a>
                </div>
                <div className="mt-5 border-t border-gray-200 pt-5 text-center text-sm" >
                    <span>Ainda não possui uma conta?</span>
                    <a href="#" className="ml-1 font-semibold text-[#6c233d] hover:underline">Criar conta</a>
                </div>

            </section>
        </main>
    )
}
export default Login