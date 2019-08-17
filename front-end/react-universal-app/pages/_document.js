import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {


    render(){
        return (
            <html>
                <Head>
                    <title>Tegra Challenge</title>
                    
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }

}