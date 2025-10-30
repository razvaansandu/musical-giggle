import styles from './buttons.module.css';

export default function SecondaryButton({ children, onClick, type = 'button' }) {
  return (
    <button className={styles.secondary} onClick={onClick} type={type}>
      {children}
    </button>
  );
}