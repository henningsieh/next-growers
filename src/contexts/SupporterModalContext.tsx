import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface SupporterModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SupporterModalContext = createContext<SupporterModalContextType>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export const useSupporterModal = () =>
  useContext(SupporterModalContext);

export const SupporterModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Check if the modal should be shown based on the next show time
    const checkIfModalShouldShow = () => {
      // Don't check on server-side
      if (typeof window === "undefined") return;

      const nextShowTimestamp = localStorage.getItem(
        "supporterModalNextShow"
      );

      // If there's no next show time set, or if current time has passed the next show time
      if (
        !nextShowTimestamp ||
        Date.now() > parseInt(nextShowTimestamp)
      ) {
        openModal();
      }
    };

    // Check when the component mounts
    checkIfModalShouldShow();

    // Optional: set up a periodic check (e.g., once per hour)
    // This ensures the modal appears without requiring a page refresh
    const intervalId = setInterval(
      checkIfModalShouldShow,
      60 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SupporterModalContext.Provider
      value={{ isModalOpen, openModal, closeModal }}
    >
      {children}
    </SupporterModalContext.Provider>
  );
};
