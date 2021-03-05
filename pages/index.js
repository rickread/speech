import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Speech - Demo</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="index.js"></script>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Speech Demo</h1>

        <form>
          <form>
            <fieldset>
              <label for="first-name">First name</label>
              <input name="first-name" type="text" />
            </fieldset>
            <fieldset>
              <label for="last-name">Last name</label>
              <input name="last-name" type="text" />
            </fieldset>
            <fieldset>
              <label for="message">Message</label>
              <textarea name="message"></textarea>
            </fieldset>
          </form>
        </form>
      </main>
    </div>
  );
}
